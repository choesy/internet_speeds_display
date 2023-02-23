

import requests,io
import os
import zipfile
from bs4 import BeautifulSoup
from glob import glob
from parse_data import parse_the_data



def run():
	password=''
	username=''
	with requests.Session() as s:

		csv_opt=glob("OPT_*.csv")
		if csv_opt:
			os.remove(csv_opt[0])
		csv_opt_2=glob("opt_*.csv")
		if csv_opt_2:
			os.remove(csv_opt_2[0])

		url = "https://egp.gu.gov.si/egp/login.html"
		headers = {'user-agent': "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chromium/80.0.3987.160 Chrome/80.0.3987.163 Safari/537.36"}
		r = s.get(url,headers=headers,verify=False)
		
		soup = BeautifulSoup(r.text, 'lxml')

		csrfToken = soup.find('input',attrs = {'name':'_csrf'})['value']
		login_data={}
		login_data['_csrf'] = csrfToken
		login_data['username'] = username
		login_data['password'] =password
		s.post(url,data=login_data,headers = headers)

		zipurl="https://egp.gu.gov.si/egp/download-file.html?id=263&format=50&d96=1"

		r = s.get(zipurl)
		z = zipfile.ZipFile(io.BytesIO(r.content))
		z.extractall("./")
		zip_fname=glob("*.zip")
		if zip_fname:
			os.remove(zip_fname)
		parse_the_data()

if __name__=="__main__":
	run()
