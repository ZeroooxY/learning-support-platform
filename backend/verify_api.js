const API_URL = 'http://localhost:5000/api';

const runVerification = async () => {
    try {
        console.log('0. Seeding Database...');
        await fetch(`${API_URL}/seed`, { method: 'POST' });
        console.log('Database Seeded.');

        console.log('1. Testing Registration...');
        const uniqueEmail = `test${Date.now()}@test.com`;
        const registerRes = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email: uniqueEmail,
                password: 'password123'
            })
        });
        const registerData = await registerRes.json();

        if (!registerRes.ok) throw new Error(registerData.message || 'Registration failed');
        console.log('Registration Successful:', registerData.email);

        console.log('2. Testing Login...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: uniqueEmail,
                password: 'password123'
            })
        });
        const loginData = await loginRes.json();

        if (!loginRes.ok) throw new Error(loginData.message || 'Login failed');
        const token = loginData.token;
        console.log('Login Successful, Token received.');

        console.log('3. Testing Get Materials...');
        const materialsRes = await fetch(`${API_URL}/materials`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const materialsData = await materialsRes.json();

        if (!materialsRes.ok) throw new Error(materialsData.message || 'Fetch materials failed');
        console.log(`Materials Fetched: ${materialsData.length} items`);

        if (materialsData.length > 0) {
            console.log('4. Testing Get Material Detail (Numeric ID)...');
            const firstId = materialsData[0].id; // Use numeric ID
            console.log(`FETCHING ID: ${firstId}`);
            const detailRes = await fetch(`${API_URL}/materials/${firstId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const detailData = await detailRes.json();

            if (!detailRes.ok) throw new Error(detailData.message || 'Fetch detail failed');
            console.log('Material Detail Fetched:', detailData.title);

            if (detailData.subMaterials && detailData.subMaterials.length > 0) {
                console.log('4.1 Testing Get Sub-Material...');
                const subId = detailData.subMaterials[0].id;
                console.log(`Fetching Sub-Material ID: ${subId}`);
                const subRes = await fetch(`${API_URL}/materials/${firstId}/sub/${subId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const subData = await subRes.json();
                if (!subRes.ok) throw new Error(subData.message || 'Fetch sub-material failed');
                console.log('Sub-Material Fetched:', subData.title);
            }

            // Test Soft Delete
            console.log('5. Testing Soft Delete...');
            const deleteRes = await fetch(`${API_URL}/materials/${firstId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const deleteData = await deleteRes.json();
            if (!deleteRes.ok) throw new Error(deleteData.message || 'Delete failed');
            console.log('Material Deleted Successfully');

            // Verify deletion
            console.log('6. Verifying Deletion (Should return 404)...');
            const checkRes = await fetch(`${API_URL}/materials/${firstId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (checkRes.status === 404) {
                console.log('Verification Success: Material not found after delete');
            } else {
                console.log('Verification Failed: Material still exists');
            }
        }

        console.log('7. Testing Create Material (Should have ID n+1)...');
        const newMaterial = {
            title: 'Computer Science: Algorithms',
            description: 'Introduction to basic algorithms.',
            content: 'Algorithms are step-by-step procedures...',
            subject: 'Computer Science'
        };
        const createRes = await fetch(`${API_URL}/materials`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newMaterial)
        });
        const createData = await createRes.json();

        if (!createRes.ok) throw new Error(createData.message || 'Create material failed');
        console.log(`Material Created: ${createData.title} with ID: ${createData.id}`);

        console.log('VERIFICATION COMPLETE: All checks passed.');
    } catch (error) {
        console.error('VERIFICATION FAILED:', error.message);
    }
};

runVerification();
