from flask import Flask
import socket

app = Flask(__name__)

@app.route('/')
def get_host_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        # The following IP address is not relevant since we're not actually connecting.
        # We're just using it to help determine the most appropriate network interface.
        s.connect(("8.8.8.8", 80))
        ip_address = s.getsockname()[0]
        s.close()
        return ip_address
    except Exception as e:
        return str(e)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
