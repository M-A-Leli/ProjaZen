import '../styles/main.css';

async function checkBackend() {
    const maxRetries = 10; // Maximum number of retries
    const retryInterval = 3000; // Retry interval in milliseconds (1 second)
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await fetch('/api/hello');
            if (response.ok) {
                const data = await response.json();
                document.getElementById('backend-status')!.textContent = data.message;
                document.getElementById('frontend-status')!.textContent = "The frontend couldn't be any happier!!!";
            } else {
                document.getElementById('backend-status')!.textContent = 'Backend could not be reached.';
                document.getElementById('frontend-status')!.textContent = 'The frontend is worried!!! ...';
                throw new Error('Response not ok');
            }
        } catch (error) {
            document.getElementById('attempts')!.textContent = `Attempt ${attempt + 1} failed. Retrying in ${retryInterval / 1000} seconds...`;
            await new Promise(resolve => setTimeout(resolve, retryInterval));
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkBackend();
});
