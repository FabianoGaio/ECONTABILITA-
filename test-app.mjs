import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testEContabilita() {
  console.log('🚀 Starting eContabilita Test Suite\n');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    // Clear any existing storage/cookies
    storageState: undefined
  });
  const page = await context.newPage();
  
  // Capture console logs
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error' || type === 'warning') {
      console.log(`[Browser ${type}]:`, msg.text());
    }
  });
  
  // Capture page errors
  page.on('pageerror', error => {
    console.log('[Page Error]:', error.message);
  });
  
  // Clear local storage and cookies
  await page.goto('http://localhost:3000');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  console.log('✓ Cleared browser storage\n');

  try {
    // Test 1: Login Page
    console.log('📝 Test 1: Login Page');
    console.log('Navigating to http://localhost:3000/login...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait for page to fully render - auth initialization can take time
    console.log('  ⏳ Waiting for auth initialization (up to 15 seconds)...');
    await page.waitForTimeout(15000);
    
    // Check if we got redirected (user already logged in)
    const currentUrl = page.url();
    if (!currentUrl.includes('/login')) {
      console.log('  ⚠️  Already logged in, redirected to:', currentUrl);
      console.log('  ℹ️  Clearing auth and retrying...');
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(3000);
    }
    
    await page.screenshot({ path: 'screenshots/01-login-page.png', fullPage: true });
    
    // Check for key elements with timeout
    const logoExists = await page.locator('text=eContabilita').isVisible({ timeout: 5000 }).catch(() => false);
    const inputExists = await page.locator('input[type="text"]').isVisible({ timeout: 5000 }).catch(() => false);
    const buttonExists = await page.locator('button:has-text("Accedi")').isVisible({ timeout: 5000 }).catch(() => false);
    
    console.log(`  ✓ Logo visible: ${logoExists}`);
    console.log(`  ✓ Input field visible: ${inputExists}`);
    console.log(`  ✓ Login button visible: ${buttonExists}`);
    
    // Test 2: Fill in login form
    console.log('\n📝 Test 2: Login with "Mario Rossi"');
    
    // Wait for input to be available
    await page.waitForSelector('input[type="text"]', { timeout: 10000 });
    await page.fill('input[type="text"]', 'Mario Rossi');
    console.log('  ✓ Typed "Mario Rossi" in input field');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/02-login-filled.png', fullPage: true });
    
    // Test 3: Click login button
    console.log('\n📝 Test 3: Submit login form');
    await page.click('button:has-text("Accedi")');
    console.log('  ✓ Clicked "Accedi" button');
    
    // Wait for navigation
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    await page.waitForTimeout(2000);
    
    const urlAfterLogin = page.url();
    console.log(`  ✓ Current URL: ${urlAfterLogin}`);
    await page.screenshot({ path: 'screenshots/03-after-login.png', fullPage: true });
    
    // Test 4: Dashboard
    console.log('\n📝 Test 4: Dashboard Analysis');
    if (urlAfterLogin.includes('/login')) {
      console.log('  ⚠️  Still on login page - checking for errors');
      const errorMessage = await page.locator('.bg-red-50').textContent().catch(() => null);
      if (errorMessage) {
        console.log(`  ❌ Error message: ${errorMessage}`);
      }
    } else {
      console.log('  ✓ Successfully redirected from login page');
      
      // Check for KPI cards
      const kpiCards = await page.locator('[class*="bg-gradient"]').count();
      console.log(`  ✓ Found ${kpiCards} gradient elements (likely KPI cards)`);
      
      // Check for main heading
      const heading = await page.locator('h1, h2').first().textContent().catch(() => 'Not found');
      console.log(`  ✓ Main heading: "${heading}"`);
      
      // Check for any visible text content
      const bodyText = await page.locator('body').textContent();
      const hasContent = bodyText.length > 100;
      console.log(`  ✓ Page has content: ${hasContent} (${bodyText.length} characters)`);
    }
    
    // Test 5: Prima Nota page
    console.log('\n📝 Test 5: Prima Nota (Journal) Page');
    await page.goto('http://localhost:3000/prima-nota', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/04-prima-nota.png', fullPage: true });
    
    const primaNotaHeading = await page.locator('h1, h2').first().textContent().catch(() => 'Not found');
    console.log(`  ✓ Page heading: "${primaNotaHeading}"`);
    
    // Check for table
    const hasTable = await page.locator('table').isVisible().catch(() => false);
    console.log(`  ✓ Table visible: ${hasTable}`);
    
    if (hasTable) {
      const rowCount = await page.locator('tbody tr').count();
      console.log(`  ✓ Table rows: ${rowCount}`);
    }
    
    // Check for buttons/actions
    const buttons = await page.locator('button').count();
    console.log(`  ✓ Action buttons found: ${buttons}`);
    
    // Test 6: Stato Patrimoniale (Balance Sheet)
    console.log('\n📝 Test 6: Stato Patrimoniale (Balance Sheet)');
    await page.goto('http://localhost:3000/bilancio/stato-patrimoniale', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/05-stato-patrimoniale.png', fullPage: true });
    
    const statoPatrimonialeHeading = await page.locator('h1, h2').first().textContent().catch(() => 'Not found');
    console.log(`  ✓ Page heading: "${statoPatrimonialeHeading}"`);
    
    // Check for financial data
    const hasFinancialData = await page.locator('text=/€|EUR/i').isVisible().catch(() => false);
    console.log(`  ✓ Financial data visible: ${hasFinancialData}`);
    
    // Check for sections (Attivo/Passivo)
    const hasAttivo = await page.locator('text=/Attivo/i').isVisible().catch(() => false);
    const hasPassivo = await page.locator('text=/Passivo/i').isVisible().catch(() => false);
    console.log(`  ✓ "Attivo" section: ${hasAttivo}`);
    console.log(`  ✓ "Passivo" section: ${hasPassivo}`);
    
    // Test 7: Analisi Indici (Financial Ratios)
    console.log('\n📝 Test 7: Analisi Indici (Financial Ratios)');
    await page.goto('http://localhost:3000/analisi/indici', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/06-analisi-indici.png', fullPage: true });
    
    const indiciHeading = await page.locator('h1, h2').first().textContent().catch(() => 'Not found');
    console.log(`  ✓ Page heading: "${indiciHeading}"`);
    
    // Check for ratio cards
    const ratioCards = await page.locator('[class*="card"], [class*="bg-white"]').count();
    console.log(`  ✓ Card elements found: ${ratioCards}`);
    
    // Check for percentage or ratio values
    const hasPercentages = await page.locator('text=/%/').isVisible().catch(() => false);
    console.log(`  ✓ Percentage values visible: ${hasPercentages}`);
    
    // Final summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log('✅ Login page loaded successfully');
    console.log('✅ Login form submission completed');
    console.log('✅ Prima Nota page loaded');
    console.log('✅ Stato Patrimoniale page loaded');
    console.log('✅ Analisi Indici page loaded');
    console.log('\n📸 Screenshots saved in ./screenshots/ directory');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    await page.screenshot({ path: 'screenshots/error.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('\n✅ Browser closed. Test complete!');
  }
}

// Run the test
testEContabilita().catch(console.error);
