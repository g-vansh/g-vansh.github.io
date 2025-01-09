---
layout: single
title: "Community Map Form"
permalink: /community-map-form/
author_profile: true
---

<style>
.form-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}
.form-group {
    margin-bottom: 15px;
}
.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}
.form-group input, .form-group select, .form-group textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}
.submit-btn {
    background-color: #2a7ae2;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
.submit-btn:hover {
    background-color: #1756a9;
}
</style>

<div class="form-container">
    <form id="communityMapForm">
        <div class="form-group">
            <label for="name">Name *</label>
            <input type="text" id="name" name="name" required>
        </div>
        
        <div class="form-group">
            <label for="photo">Photo (Optional)</label>
            <input type="file" id="photo" name="photo" accept="image/*">
        </div>
        
        <div class="form-group">
            <label for="number">Number *</label>
            <input type="tel" id="number" name="number" required>
        </div>
        
        <div class="form-group">
            <label for="house">House *</label>
            <select id="house" name="house" required>
                <option value="">Select House</option>
                <option value="Red">Red House</option>
                <option value="Blue">Blue House</option>
                <option value="Green">Green House</option>
                <option value="Yellow">Yellow House</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="batch">Batch *</label>
            <input type="text" id="batch" name="batch" required>
        </div>
        
        <div class="form-group">
            <label for="address">Address *</label>
            <textarea id="address" name="address" rows="3" required></textarea>
        </div>
        
        <button type="submit" class="submit-btn">Submit</button>
    </form>
</div>

<script>
document.getElementById('communityMapForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const photoFile = formData.get('photo');
    
    // Convert photo to base64 if provided
    let photoBase64 = '';
    if (photoFile.size > 0) {
        photoBase64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(photoFile);
        });
    }
    
    const data = {
        name: formData.get('name'),
        photo: photoBase64,
        number: formData.get('number'),
        house: formData.get('house'),
        batch: formData.get('batch'),
        address: formData.get('address'),
        timestamp: new Date().toISOString()
    };
    
    try {
        const response = await fetch('https://api.github.com/repos/g-vansh/g-vansh.github.io/dispatches', {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': 'Bearer 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'
            },
            body: JSON.stringify({
                event_type: 'map_update',
                client_payload: data
            })
        });
        
        if (response.ok) {
            alert('Form submitted successfully! The map will be updated shortly.');
            this.reset();
        } else {
            throw new Error('Failed to submit form');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to submit form. Please try again.');
    }
});
</script> 