function calculateGST(price) {
    const gst = price * 0.18;
    return gst.toFixed(2);
}

export default calculateGST;