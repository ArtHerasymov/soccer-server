import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';


@Injectable()
export class SplitPipe implements  PipeTransform {
  transform(data: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'query') {
      const keys = Object.keys(data);
      if (!keys.length) {
        return {};
      }
      keys.forEach(key => data[key] = data[key].indexOf(',') === -1 ? data[key] : data[key].split(','));
    }
    console.log(data);
    return data;
  }
}
