import { expect, test as setup } from '@playwright/test';

setup('setup E2E backend database', async ({ request }) => {
  const resetResponse = await request.post('http://localhost:4000/api/__reset');

  await expect(resetResponse).toBeOK();
});
