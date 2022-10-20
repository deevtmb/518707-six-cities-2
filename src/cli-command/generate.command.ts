import got from 'got';
import TSVFileWriter from '../common/file-writer/file-writer.js';
import { MockData } from '../types/mock-data.type.js';
import { CliCommandInterface } from './cli-command.interface.js';
import OfferGenerator from '../common/offer-generator/offer-generator.js';
import { DEFAULT_FILEPATH, DEFAULT_OFFER_COUNT, DEFAULT_URL } from './cli-command.constant.js';

export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private initialData!: MockData;

  public async execute(...parameters: string[]): Promise<void> {
    const [countParam, filepathParam, urlParam] = parameters;
    const count = countParam ?? DEFAULT_OFFER_COUNT;
    const filepath = filepathParam ?? DEFAULT_FILEPATH;
    const url = urlParam ?? DEFAULT_URL;

    try {
      this.initialData = await got.get(url).json();
    } catch {
      return console.log(`Can't fetch data from ${url}.`);
    }

    const offerGeneratorString = new OfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < +count; i++) {
      await tsvFileWriter.write(offerGeneratorString.generate());
    }

    console.log(`File ${filepath} was created!`);
  }
}
