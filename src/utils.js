
export const removeFileExtension = (filename) => {
    return filename.replace(/\.[^/.]+$/, "");
}