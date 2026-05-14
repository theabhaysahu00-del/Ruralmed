const puppeteer = require('puppeteer');
const axios = require('axios');
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
  console.log('Starting E2E Test...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  try {
    // 1. Doctor Registration
    console.log('Navigating to Doctor Signup...');
    await page.goto('http://localhost:5173/doctor-signup');
    await delay(2000);
    
    // Fill form
    await page.type('input[type="text"][placeholder="Dr. John Doe"]', 'Dr. Automated Test');
    await page.type('input[type="email"]', 'automated_doc@ruralmed.in');
    await page.type('input[type="text"][placeholder="+91 98765 43210"]', '9876543210');
    await page.type('input[type="text"][placeholder="MCI/Reg/12345"]', 'MCI12345');
    await page.select('select', 'Cardiologist');
    await page.type('input[type="text"][placeholder="Apollo Clinic"]', 'Test Clinic');
    await page.type('input[type="number"]', '5');
    await page.type('input[type="password"]', 'Password@123');
    
    // Upload file
    const fileInput = await page.$('input[type="file"]');
    await fileInput.uploadFile(LICENSE_IMG);
    await delay(1000);
    
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '01_registration_filled.png'), fullPage: true });
    
    console.log('Submitting Registration...');
    await page.click('button[type="submit"]');
    await delay(3000); // Wait for success toast and redirect
    
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '02_registration_success.png'), fullPage: true });
    
    // 2. Admin Verification
    console.log('Navigating to Admin Login...');
    await page.goto('http://localhost:5173/admin-login');
    await delay(2000);
    
    await page.type('input[type="email"]', 'phantomtechies@gmail.com');
    await page.type('input[type="password"]', 'Phantom@2027');
    await page.click('button[type="submit"]');
    await delay(3000);
    
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '03_admin_dashboard.png'), fullPage: true });
    
    // Find "Approve" button and click
    console.log('Approving Doctor...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const approveBtn = buttons.find(b => b.textContent.includes('Approve'));
      if (approveBtn) approveBtn.click();
    });
    await delay(2000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '04_doctor_approved.png'), fullPage: true });
    
    // 3. Doctor Login
    console.log('Navigating to Doctor Login...');
    // We should logout admin or just navigate since tokens might overwrite. But let's clear local storage just in case.
    await page.evaluate(() => localStorage.clear());
    
    await page.goto('http://localhost:5173/doctor-login');
    await delay(2000);
    
    await page.type('input[type="email"]', 'automated_doc@ruralmed.in');
    await page.type('input[type="password"]', 'Password@123');
    await page.click('button[type="submit"]');
    await delay(3000);
    
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '05_doctor_dashboard.png'), fullPage: true });
    
    console.log('Test Complete!');
  } catch (err) {
    console.error('Test Failed:', err);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'error_state.png'), fullPage: true });
  } finally {
    await browser.close();
  }
}

runTest();
