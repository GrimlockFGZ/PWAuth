document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: username, password: password }),
    })
        .then(response => response.text())
        .then(data => {
            if (data === 'Success') {
                alert('Login successful');
                // Redirect or perform other actions
            } else {
                alert('Login failed');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});