import { Given, When, Then} from '@cucumber/cucumber';

const Dado: typeof Given = Given;
const Quando: typeof When = When;
const Entao: typeof Then = Then;
const E = (description: string, implementation: (...args: any[]) => void | Promise<void>) => {
  Then(description, implementation);
  };

export { Dado, Quando, Entao, E };

