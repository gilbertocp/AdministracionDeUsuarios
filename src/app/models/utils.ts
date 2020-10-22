export class Utils {
  static validEmail(str: string ): boolean {

    if(str === undefined) {
      return false;
    }

    return str.includes('@') && str.indexOf('.') > -1;
  }

  static isEmpty(str: string): boolean {
    return str === undefined || str === ''; 
  }

  static samePassword(str1: string, str2: string): boolean {
    return str1 === str2;
  }

  static getDirectory(fullPath: string): string {
    return fullPath.substr(0, fullPath.lastIndexOf('/') + 1);
  }

  static getFilename(fullPath: string): string {
    return fullPath.substr(fullPath.lastIndexOf('/') + 1);
  }

  static getFilenameGallery(fullPath: string): string {
    const path = fullPath.split('?')[0];
    return path.substr(path.lastIndexOf('/') + 1);
  }
}
