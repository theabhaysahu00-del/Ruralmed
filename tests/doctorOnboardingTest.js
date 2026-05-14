const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\stara\\.gemini\\antigravity\\brain\\5509a262-06ee-4e35-9141-796e30290ea2';
const LICENSE_IMG = path.join(ARTIFACT_DIR, 'medical_license_sample_1778444265253.png');

async function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}

async function runTest() {
  console.log('Starting Full Doctor Onboarding E2E Test...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const doctorPage = await browser.newPage();
  await doctorPage.setViewport({ width: 1280, height: 800 });

  const adminPage = await browser.newPage();
  await adminPage.setViewport({ width: 1280, height: 800 });

  try {
    // 1. Doctor Registration
    console.log('1. Registering Doctor...');
    await doctorPage.goto('http://localhost:5173/doctor-signup');
    await delay(2000);
    
    // Fill form
    const uniqueEmail = `dr_${Date.now()}@ruralmed.in`;
    console.log('Typing name...');
    await doctorPage.type('input[type="text"][placeholder="Dr. John Doe"]', 'Dr. Timeline Test');
    console.log('Typing email...');
    await doctorPage.type('input[type="email"]', uniqueEmail);
    console.log('Typing phone...');
    await doctorPage.type('input[type="text"][placeholder="+91 98765 43210"]', '9876543211');
    console.log('Typing license...');
    await doctorPage.type('input[type="text"][placeholder="MCI/Reg/12345"]', 'MCI99999');
    console.log('Selecting dropdown...');
    await doctorPage.select('select', 'Pediatrician');
    console.log('Typing hospital...');
    await doctorPage.type('input[type="text"][placeholder="Apollo Clinic"]', 'Timeline Clinic');
    console.log('Typing exp...');
    await doctorPage.type('input[type="number"]', '8');
    console.log('Typing pwd...');
    await doctorPage.type('input[type="password"]', 'Password@123');
    
    console.log('Uploading file...');
    const fileInput = await doctorPage.$('input[type="file"]');
    await fileInput.uploadFile(LICENSE_IMG);
    console.log('File uploaded.');
    await delay(1000);
    await doctorPage.screenshot({ path: path.join(ARTIFACT_DIR, '01_registration_filled.png'), fullPage: true });
    
    await doctorPage.evaluate(() => {
      document.querySelector('button[type="submit"]').click();
    });
    await delay(3000); 
    await doctorPage.screenshot({ path: path.join(ARTIFACT_DIR, '02_registration_success.png'), fullPage: true });

    // 2. Doctor Login -> Redirect to Status Tracker
    console.log('2. Doctor Login (Pending)...');
    await doctorPage.goto('http://localhost:5173/doctor-login');
    await delay(2000);
    await doctorPage.type('input[type="email"]', uniqueEmail);
    await doctorPage.type('input[type="password"]', 'Password@123');
    await doctorPage.evaluate(() => {
      document.querySelector('button[type="submit"]').click();
    });
    await delay(3000);
    
    // Should be at /doctor-verification-status
    console.log('Waiting at Verification Status Tracker...');
    await doctorPage.screenshot({ path: path.join(ARTIFACT_DIR, '03_verification_status_tracker_pending.png'), fullPage: true });

    // 3. Admin Approval
    console.log('3. Admin Logging In...');
    await adminPage.goto('http://localhost:5173/admin-login');
    await delay(2000);
    await adminPage.type('input[type="email"]', 'phantomtechies@gmail.com');
    await adminPage.type('input[type="password"]', 'Phantom@2027');
    await adminPage.evaluate(() => {
      document.querySelector('button[type="submit"]').click();
    });
    await delay(3000);

    await adminPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await delay(2000);
    await adminPage.screenshot({ path: path.join(ARTIFACT_DIR, '04_admin_sees_pending.png'), fullPage: true });

    console.log('4. Admin Approving...');
    await adminPage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const approveBtn = buttons.find(b => b.textContent.includes('Approve'));
      if (approveBtn) approveBtn.click();
    });
    await delay(2000);
    await adminPage.screenshot({ path: path.join(ARTIFACT_DIR, '05_admin_approved.png'), fullPage: true });

    // 4. Wait for Doctor to Auto-Redirect
    console.log('5. Waiting for Doctor Status Tracker Auto-Redirect (Polling)...');
    // The component polls every 5s, we wait 7s.
    await delay(7000);
    
    await doctorPage.screenshot({ path: path.join(ARTIFACT_DIR, '06_doctor_tracker_approved.png'), fullPage: true });

    // After approval UI updates, it waits 2 seconds to reload to /doctor.
    await delay(3000);
    
    console.log('6. Final Doctor Dashboard...');
    await doctorPage.screenshot({ path: path.join(ARTIFACT_DIR, '07_doctor_dashboard_auto_redirect.png'), fullPage: true });

    console.log('Test Complete!');
  } catch (err) {
    console.error('Test Failed:', err);
    await doctorPage.screenshot({ path: path.join(ARTIFACT_DIR, 'error_state_doc.png'), fullPage: true });
    await adminPage.screenshot({ path: path.join(ARTIFACT_DIR, 'error_state_admin.png'), fullPage: true });
  } finally {
    await browser.close();
  }
}

runTest();
