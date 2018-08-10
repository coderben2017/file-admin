import { FileAdminPage } from './app.po';

describe('file-admin App', function() {
  let page: FileAdminPage;

  beforeEach(() => {
    page = new FileAdminPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
