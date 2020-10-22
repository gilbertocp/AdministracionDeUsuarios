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
}
