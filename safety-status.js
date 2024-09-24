document.addEventListener('DOMContentLoaded', function () {
    const currentUrl = window.location.href;

    // Function to display safety status
    const displaySafetyStatus = (url, score) => {
        const statusContainer = document.getElementById('safetyStatusContainer');
        const statusDiv = document.createElement('div');
        statusDiv.className = 'p-4 rounded shadow';

        if (score === undefined) {
            statusDiv.className += ' bg-yellow-300'; // Not reviewed
            statusDiv.innerText = `URL: ${url} - Safety Status: Not Reviewed`;
        } else if (score < 30) {
            statusDiv.className += ' bg-red-500 text-white'; // Unsafe
            statusDiv.innerText = `URL: ${url} - Safety Status: Unsafe (Score: ${score})`;
        } else {
            statusDiv.className += ' bg-green-500 text-white'; // Safe
            statusDiv.innerText = `URL: ${url} - Safety Status: Safe (Score: ${score})`;
        }

        statusContainer.appendChild(statusDiv);
    };

    // Retrieve and display safety scores
    chrome.storage.local.get(null, (data) => {
        for (const url in data) {
            displaySafetyStatus(url, data[url]);
        }
    });

    // Submit safety score
    document.getElementById('submitScore').addEventListener('click', function () {
        const score = document.getElementById('scoreInput').value;
        if (score >= 0 && score <= 100) {
            // Save the score for the current page in local storage
            chrome.storage.local.set({ [currentUrl]: score }, () => {
                displaySafetyStatus(currentUrl, score); // Update display
            });
        } else {
            alert('Please enter a valid score between 0 and 100.');
        }
    });
});