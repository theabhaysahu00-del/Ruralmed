// Test script: Register a doctor with file upload, then verify admin can see it
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000';

async function main() {
  console.log('=== STEP 1: Creating test license file ===');
  const testFilePath = path.join(__dirname, 'test_license.txt');
  fs.writeFileSync(testFilePath, 'This is a test medical license document for Dr. Meera Sharma');
  console.log('✅ Test file created');

  console.log('\n=== STEP 2: Registering Doctor ===');
  const form = new FormData();
  form.append('name', 'Dr. Meera Sharma');
  form.append('email', 'dr.meera@ruralmed.in');
  form.append('phone', '9876543210');
  form.append('password', 'MeeraDoc@2027');
  form.append('licenseNumber', 'MCI/REG/12345');
  form.append('specialization', 'Cardiologist');
  form.append('hospital', 'Apollo Rural Clinic');
  form.append('experience', '8');
  form.append('role', 'doctor');
  
  // Create a fake PDF file for testing
  const pdfBuffer = Buffer.from('%PDF-1.4 test license content');
  const pdfPath = path.join(__dirname, 'test_license.pdf');
  fs.writeFileSync(pdfPath, pdfBuffer);
  form.append('license', fs.createReadStream(pdfPath), { filename: 'license.pdf', contentType: 'application/pdf' });

  try {
    const regResponse = await axios.post(`${BASE_URL}/api/doctors/register`, form, {
      headers: form.getHeaders()
    });
    console.log('✅ Registration Response:', JSON.stringify(regResponse.data, null, 2));
    console.log('   - Success:', regResponse.data.success);
    console.log('   - User Role:', regResponse.data.data?.user?.role);
    console.log('   - Approval Status:', regResponse.data.data?.user?.approvalStatus);
    console.log('   - Verification Stage:', regResponse.data.data?.user?.verificationStage);
    console.log('   - License File:', regResponse.data.data?.user?.medicalLicenseFile);
  } catch (err) {
    console.error('❌ Registration failed:', err.response?.data || err.message);
    process.exit(1);
  }

  console.log('\n=== STEP 3: Admin Login ===');
  let adminToken;
  try {
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'phantomtechies@gmail.com',
      password: 'Phantom@2027'
    });
    adminToken = loginResponse.data.data?.token;
    console.log('✅ Admin logged in successfully');
    console.log('   - Role:', loginResponse.data.data?.user?.role);
  } catch (err) {
    console.error('❌ Admin login failed:', err.response?.data || err.message);
    process.exit(1);
  }

  console.log('\n=== STEP 4: Fetching Pending Requests ===');
  try {
    const pendingResponse = await axios.get(`${BASE_URL}/api/admin/pending-requests`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Pending Requests:', pendingResponse.data.data?.length, 'found');
    pendingResponse.data.data?.forEach((req, i) => {
      console.log(`\n   Request #${i + 1}:`);
      console.log(`   - Name: ${req.name}`);
      console.log(`   - Email: ${req.email}`);
      console.log(`   - Phone: ${req.phone}`);
      console.log(`   - Role: ${req.role}`);
      console.log(`   - Specialization: ${req.specialization}`);
      console.log(`   - Hospital: ${req.hospital}`);
      console.log(`   - License File: ${req.medicalLicenseFile}`);
      console.log(`   - Approval Status: ${req.approvalStatus}`);
      console.log(`   - Verification Stage: ${req.verificationStage}`);
    });
  } catch (err) {
    console.error('❌ Failed to fetch pending requests:', err.response?.data || err.message);
  }

  console.log('\n=== STEP 5: Fetching All Doctors (Admin) ===');
  try {
    const doctorsResponse = await axios.get(`${BASE_URL}/api/admin/all-doctors`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ All Doctors:', doctorsResponse.data.data?.length, 'found');
  } catch (err) {
    console.error('❌ Failed to fetch all doctors:', err.response?.data || err.message);
  }

  // Cleanup test files
  try { fs.unlinkSync(testFilePath); } catch(e) {}
  try { fs.unlinkSync(pdfPath); } catch(e) {}

  console.log('\n=== ✅ END-TO-END TEST COMPLETE ===');
}

main().catch(console.error);
