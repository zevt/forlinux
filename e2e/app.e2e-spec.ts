import { ExperimentPage } from './app.po';

describe('experiment App', () => {
  let page: ExperimentPage;

  beforeEach(() => {
    page = new ExperimentPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
