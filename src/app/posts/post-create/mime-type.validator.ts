import { AbstractControl } from '@angular/forms';
import { Observable, Observer } from 'rxjs';


//null return object means valid
//async validator, must return a promise or observable rather than just null if valid
//key: string } it should have a property, that can be interpreted as a string, and name is not important
export const mimeType = (
  control: AbstractControl
  ): Promise<{[key: string]: any}> | Observable<{ [key: string]: any}> => {
    const file = control.value as File;
    const fileReader = new FileReader();
    const frObs = Observable.create((observer: Observer<{ [key: string]: any }>) => {
      fileReader.addEventListener("loadend", () => {
          //so callback method is setup, then an async method is called
          const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
          //Uint8Array allows one to actually check the file
          let header = "";
          let isValid = false;
          for(let i=0; i < arr.length; i++){
            header += arr[i].toString(16);
          }
          switch (header){
            case "89504e47":
              isValid = true;
              break;
            case "ffd8ffe0":
            case "ffd8ffe1":
            case "ffd8ffe2":
            case "ffd8ffe3":
            case "ffd8ffe8":
              isValid = true;
              break;
            default:
              isValid = false; // Or you can use the blob.type as fallback
              break;
          }
          if(isValid){
            observer.next(null);
          } else {
            observer.next({ invalidMimeType: true});
          }
          observer.complete();
      });
      fileReader.readAsArrayBuffer(file);
    });
    //
    return frObs;
}
