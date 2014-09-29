def convert_type(s):
	try:
		try:
			return int(s)
		except ValueError:
			return float(s)
	except ValueError:
		return s