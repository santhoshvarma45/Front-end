// Initialize Amplify
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);
// File upload function
async function uploadFile(file) {
    try {
        const response = await fetch('https://YOUR_API_GATEWAY_URL/files', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${(await Auth.currentSession()).idToken.jwtToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fileName: file.name,
                contentType: file.type
            })
        });
        
        const data = await response.json();
        
        // Direct upload to S3 using presigned URL
        const uploadResponse = await fetch(data.uploadUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type
            }
        });
        
        if (uploadResponse.ok) {
            console.log('File uploaded successfully');
        }
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}
// Get user's files
async function getUserFiles() {
    try {
        const response = await fetch('https://YOUR_API_GATEWAY_URL/files', {
            headers: {
                'Authorization': `Bearer ${(await Auth.currentSession()).idToken.jwtToken}`
            }
        });
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching files:', error);
        return [];
    }
}
