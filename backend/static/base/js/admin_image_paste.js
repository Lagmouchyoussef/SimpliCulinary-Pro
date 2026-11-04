document.addEventListener('paste', function (e) {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (const item of items) {
        if (item.kind === 'file' && item.type.startsWith('image/')) {
            const blob = item.getAsFile();
            const fileInput = document.querySelector('input[type="file"]');
            
            if (fileInput) {
                // Build a DataTransfer container to simulate a file drop
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(blob);
                fileInput.files = dataTransfer.files;
                
                // Optional: confirm the paste to the admin
                alert('Image pasted successfully!');
                
                // Trigger a change event so the admin widget refreshes
                fileInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    }
});
