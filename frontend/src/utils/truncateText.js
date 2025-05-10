function truncateText(text,limit) {
    let newText = String(text)
    return newText.length > limit ? newText.slice(0,limit) + "..." : text
}

export default truncateText