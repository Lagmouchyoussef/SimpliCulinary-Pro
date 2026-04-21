document.addEventListener('paste', function (e) {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (const item of items) {
        if (item.kind === 'file' && item.type.startsWith('image/')) {
            const blob = item.getAsFile();
            const fileInput = document.querySelector('input[type="file"]');
            
            if (fileInput) {
                // Créer un conteneur DataTransfer pour simuler un dépôt de fichier
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(blob);
                fileInput.files = dataTransfer.files;
                
                // Optionnel : Afficher un message de succès
                alert('Image collée avec succès !');
                
                // Forcer le rafraîchissement visuel si nécessaire
                fileInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    }
});
