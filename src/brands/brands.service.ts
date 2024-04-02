import { Injectable } from '@nestjs/common';
import Brand from './brands-schema';
import brandSchema, { BrandSchema } from './brand-zod-schema';
import { ZodIssue } from 'zod';
import { faker } from '@faker-js/faker';
import Transformer, {
  AltKeyOptions,
  AtlKeyCondition,
} from 'src/utils/transformer';

type TransformOptions = {
  [key: string]: {
    regex: RegExp;
    condition: AtlKeyCondition;
    options?: AltKeyOptions;
  };
};

@Injectable()
export class BrandsService {
  async findAll() {
    return Brand.find();
  }

  async validateAll(skip?: number, limit?: number) {
    const brands = await Brand.find({}, {}, { skip, limit });
    const validation = brands.map(this.isValid);
    const result = await Promise.all(validation);

    return result.reduce(
      (prev, curr) => {
        prev.original.push(curr.data);
        prev.transformed.push(curr.transform);
        return prev;
      },
      { original: [], transformed: [] },
    );
  }

  async validateAndUpdate() {
    const validation = await this.validateAll();
    const update = validation.original.map((doc, i) => {
      return {
        updateOne: {
          filter: { _id: doc._id },
          update: validation.transformed[i],
        },
      };
    });
    return Brand.bulkWrite(update);
  }

  async extendDatabase() {
    return this.generateBrands();
  }

  private isValid = async (brand: BrandSchema) => {
    const result = await brandSchema.safeParseAsync(brand);
    if (result.success == true)
      return { data: brand, valid: true, transform: brand };
    const issues = result.error.issues;
    const transform = this.transform(brand, issues) as BrandSchema;
    return { data: brand, valid: !issues.length, transform };
  };

  private transform = (brand: BrandSchema, issues: ZodIssue[]) => {
    const tranformer = new Transformer({ ...brand['_doc'] });

    // Transform options for each property
    const transformOptions: TransformOptions = {
      yearFounded: {
        regex: /(year|founded)/i,
        condition: (value: any) => {
          return +value && value >= 1600 && value <= new Date().getFullYear();
        },
        options: {
          valueTransform: (value: any) => +value,
          defaultValue: 1600,
        },
      },
      numberOfLocations: {
        regex: /(number|locations)/i,
        condition: (value: any) => +value && value >= 1,
        options: {
          valueTransform: (value: any) => +value,
          defaultValue: 1,
        },
      },
      headquarters: {
        regex: /(h\w*q\w*)/i,
        condition: (value: any) => typeof value == 'string',
        options: { deep: true },
      },
      brandName: {
        regex: /(brand|name)/i,
        condition: (value: any) => typeof value == 'string',
        options: { deep: true },
      },
    };

    issues.forEach((issue) => {
      const path = issue.path[0];
      const { condition, options, regex } = transformOptions[path];
      const { deep, defaultValue, valueTransform } = options;

      // Replace invalid data by data from alternative properties
      tranformer.altKey(path, regex, condition, {
        deep,
        defaultValue,
        valueTransform,
      });
    });

    // Remove extra props keeping only the passed properties
    tranformer.cleanObject([
      '_id',
      'yearFounded',
      'numberOfLocations',
      'headquarters',
      'brandName',
    ]);

    return tranformer.result;
  };

  private generateBrands = async (count = 10, seed = 2024) => {
    faker.seed(seed);
    const brands = Array.from({ length: count }, () => {
      return new Brand({
        brandName: faker.company.name(),
        yearFounded: faker.number.int({
          min: 1600,
          max: new Date().getFullYear(),
        }),
        headquarters: faker.location.city(),
        numberOfLocations: faker.number.int({ min: 1, max: 10 }),
      });
    });

    await Brand.insertMany(brands);
    return brands;
  };
}
