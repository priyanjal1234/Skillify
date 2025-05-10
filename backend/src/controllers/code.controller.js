import Docker from 'dockerode';
import ApiError from '../utils/ApiError.js';

const docker = new Docker();

const runCode = async function (req, res, next) {
  try {
    let { language, code } = req.body;

    let image, command;

    if (language === 'javascript') {
      // Escape single quotes properly
      const escapedCode = String(code).replace(/'/g, "'\\''");
      command = `sh -c "mkdir -p /app && echo '${escapedCode}' > /app/code.js && node /app/code.js"`;
      image = 'node:18';
    } else if (language === 'c') {
      command = `sh -c "mkdir -p /app && printf '%s' '${String(code)}' > /app/code.c && gcc /app/code.c -o /app/a.out && /app/a.out"`;
      image = 'gcc:latest';
    } else if (language === 'cpp') {
      command = `sh -c "mkdir -p /app && printf '%s' '${String(code)}' > /app/code.cpp && g++ /app/code.cpp -o /app/a.out && /app/a.out"`;
      image = 'gcc:latest';
    } else {
      return res.status(400).json({ error: 'Unsupported language' });
    }

    const container = await docker.createContainer({
      Image: image,
      Cmd: ['sh', '-c', command],
      Tty: false,
      HostConfig: { AutoRemove: true },
      AttachStdout: true,
      AttachStderr: true,
    });

    await container.start();

    const stream = await container.logs({
      stdout: true,
      stderr: true,
      follow: true,
    });

    let output = '';
    stream.on('data', (chunk) => {
      output += chunk.slice(8).toString();
    });

    await container.wait();

    res.json(output);
  } catch (error) {
    return next(new ApiError(500, error.message || 'Error running code'));
  }
};

export { runCode };
