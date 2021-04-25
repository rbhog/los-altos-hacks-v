from tableauscraper import TableauScraper as TS

url = "https://dataviz1.dc.gov/t/OCTO/views/Vaccine_Public/Coverage"

ts = TS()
ts.loads(url)

wb = ts.getWorkbook()

parameters = wb.getParameters()
print(parameters)
wb = wb.setParameter("MapChoice", "Count (#)")
#wb = wb.setParameter("Special Pop", "DC residents")
for ws in wb.worksheets:
	print(ws.data)
