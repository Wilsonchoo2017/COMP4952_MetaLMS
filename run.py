from metaLMS import create_app
app = create_app()
app.run(debug=True, port=7777, host='0.0.0.0')
