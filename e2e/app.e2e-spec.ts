import { JiraMigrationPage } from './app.po';

describe('jira-migration App', function() {
  let page: JiraMigrationPage;

  beforeEach(() => {
    page = new JiraMigrationPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
