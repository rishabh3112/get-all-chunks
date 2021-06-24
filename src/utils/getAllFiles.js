import glob from "glob-promise";

export const getAllFiles = async (cwd = process.cwd()) => {
    const files = await glob(cwd + "/**/*.+(js|ts|tsx)");
    return files.filter(file => !file.includes('node_modules'));
}