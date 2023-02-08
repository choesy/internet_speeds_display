import json
import functions as fu
import os
import pandas as pd
import csv
from collections import Counter
import pathlib
from glob import glob

def parse_the_data():
	filepath=pathlib.Path(__file__).parent.absolute()

	#Load csv where we have id of municipality and name of municipality correspondent.
	obcineCsv=pd.read_csv("idobcine.csv",sep=',')

	#Load table with MAT number of internet provider that corresponds with name
	ponudnikiCsv=pd.read_csv("idponudnika.csv",sep=',')
	dictponudnikov=ponudnikiCsv.set_index('MATST').to_dict()['IME'] #ustvarimo dictionary iz tega

	#Load main csv with all the data
	path=glob("OPT_*.csv")[0]
	filen=path.split(os.sep)[-1]

	file = open(path, encoding="utf8").readlines()[1:]
	reader = csv.reader(file, delimiter=';')
	#extrapolate the date from name of csv
	datum=' '.join([str(filen[10:12]),'.',str(filen[8:10]),'.', str(filen[4:8])])
	#initiate dictionary for municipalyty id that already occured
	dictHsmid={}
	#initiate dictionary to save data
	dataDict={}

	'''
	We iterate trough rows of csv, where each row represets one internet connection.
	'''
	for row in reader:
		#we drop data that is not household or it is not connected
		if ((row[12] == "3") or (row[9] != "1")): # ce zelimo da se glede na to ali je prikopljen se doda: or(row[12] is "3")
			continue

		#We check if seleced row has not None data or it is not empty
		hsmid=row[6]
		if ((hsmid == None) or (hsmid == "")):
			continue

		#We get the municipality id
		sifko=row[2]

		vrsta_prikljucka=fu.getTechnologyType(int(row[10])) #Return type of internet connection
		
		#get minimal internet speed that is acessibile to this household.
		min_hitrost=row[11]
		if (float(min_hitrost)<1):
			min_hitrost=1
			
		mat_st=int(row[13])

		#we replace intertet providers MAT number with actual name of internet provider
		if mat_st in dictponudnikov:
			mat_st=dictponudnikov[mat_st]
		else:
			mat_st="DRUGI"

		#Cheeck if municipality id already exists in the dictionary, else we add it.
		if sifko not in dataDict:
			dataDict.update({sifko:{'minhitrosti':{},'ponudniki':{},'tehnologije':{}}})
		
		#Check if internet provider exists in dictionary in this municipality id, else we add it.
		if mat_st not in dataDict[sifko]:
			dataDict[sifko][mat_st]={}
		
		#Check if type of internet connection exists in dictionary in this municipality id for specific internet provider , else we add it.
		if vrsta_prikljucka not in dataDict[sifko][mat_st]:
			dataDict[sifko][mat_st][vrsta_prikljucka]={}

		##Check minimuma avaiable speed in dictionary in this municipality id for this specific internet provider. if it exists, we add 1, else we initiate it to 1.
		if min_hitrost in dataDict[sifko][mat_st][vrsta_prikljucka]:
			dataDict[sifko][mat_st][vrsta_prikljucka][min_hitrost]+=1
		else:
			dataDict[sifko][mat_st][vrsta_prikljucka][min_hitrost]=1
		
		#we create another section in dictionary that counts how many internet providers are in municipality and their share.
		#if provider exists we add 1, else we initiate it to 1
		if mat_st in dataDict[sifko]['ponudniki']:
			dataDict[sifko]['ponudniki'][mat_st]+=1
		else:
			dataDict[sifko]['ponudniki'][mat_st]=1

		#we append avaiable types of internet connection into household.
		#we edit the dictionary in a way that only internet connection in the same household that is the highest, stays in dictionary.
		vrsta_prikljucka_st=int(row[10])
		if hsmid not in dictHsmid:
			dictHsmid.update({hsmid:[vrsta_prikljucka_st,min_hitrost,sifko]})
		else:
			if vrsta_prikljucka_st<dictHsmid[hsmid][0]:
				dictHsmid[hsmid]=[vrsta_prikljucka_st,min_hitrost,sifko]
		
	#transform types of conetction from keys to their names
	for key in dictHsmid:
		dictHsmid[key][0]=fu.getTechnologyType(dictHsmid[key][0])

	#We append each type of internet connection to corresponding municipality
	for key in dictHsmid:
		sifko=dictHsmid[key][2]
		vrsta_prikljucka=dictHsmid[key][0]
		min_hitrost=dictHsmid[key][1]
		if min_hitrost in dataDict[sifko]['minhitrosti']:
			dataDict[sifko]['minhitrosti'][min_hitrost]+=1
		else:
			dataDict[sifko]['minhitrosti'][min_hitrost]=1
		if vrsta_prikljucka in dataDict[sifko]['tehnologije']:
			dataDict[sifko]['tehnologije'][vrsta_prikljucka]+=1
		else:
			dataDict[sifko]['tehnologije'][vrsta_prikljucka]=1


	#Join all municipality ids that are the same for one municipality
	dataDictObcine={}
	for key in dataDict:
		try:
			newName=obcineCsv[obcineCsv['SIFKO']==int(key)]['IMEOB'].values[0] # izberemo ime ki pripada sifri
			if newName in dataDictObcine:
				for seckey in dataDict[key]:
					if any(isinstance(i,dict) for i in dataDict[key][seckey].values()):
						for kkk in dataDict[key][seckey]:
							if seckey in dataDictObcine[newName]:
								if kkk in dataDictObcine[newName][seckey]:
									dataDictObcine[newName][seckey][kkk]=dict(Counter(dataDictObcine[newName][seckey][kkk])+Counter(dataDict[key][seckey][kkk]))
								else:
									dataDictObcine[newName][seckey][kkk]=dataDict[key][seckey][kkk]
							else:
								dataDictObcine[newName][seckey]=dataDict[key][seckey]
					else:
						dataDictObcine[newName][seckey]=dict(Counter(dataDictObcine[newName][seckey])+Counter(dataDict[key][seckey])) # sestejemo podatke sifer			
			else:
				dataDictObcine[newName]=dataDict[key]
		except Exception as e:
			print(e)

	#we initiate another dictionary that will hold new modified data
	finalDict={}
	lowerTreshold=30
	higherTreshold=100

	#we convert all the data into percentahe of shares per municipality and save it to finaldict
	for obcina in dataDictObcine:
		hitrosti=fu.calculatePercentage(dataDictObcine[obcina]['minhitrosti'])
		mejnehitrosti=fu.calculatePercentageGroup(dataDictObcine[obcina]['minhitrosti'],lowerTreshold,higherTreshold)
		topPonudnik=fu.calculatePercentage(dataDictObcine[obcina]['ponudniki'])
		tehnologijePriklopa=fu.calculatePercentage(dataDictObcine[obcina]['tehnologije'])
		finalDict.update({obcina:{'hitrosti':hitrosti,'mejnehitrosti':mejnehitrosti,'topponudnik':topPonudnik,'tehnologije':tehnologijePriklopa}})

	#We calculate what rank the municipality is from 1 to 212 based on internet connection speeds

	keynameHigh=str(higherTreshold)+'+'
	keynameLow=str(lowerTreshold)+'-'+str(higherTreshold-1)
	compareDictHigh={}
	compareDictLow={}
	for obcina in finalDict:
		compareDictHigh.update({obcina:finalDict[obcina]['mejnehitrosti'][keynameHigh]})
		compareDictLow.update({obcina:finalDict[obcina]['mejnehitrosti'][keynameLow]+finalDict[obcina]['mejnehitrosti'][keynameHigh]})
	#We sort dictionary by internet speed
	sortedDictHigh={k: v for k, v in sorted(compareDictHigh.items(), key=lambda item: item[1],reverse=True)}
	sortedDictLow={k: v for k, v in sorted(compareDictLow.items(), key=lambda item: item[1],reverse=True)}
	#now we set the rank of each municipality based on at least 100MBps criterium or at least 30MBps criterium
	for key in sortedDictHigh:
		finalDict[key].update({'Rank100':list(sortedDictHigh).index(key)+1})
		finalDict[key].update({'Rank30':list(sortedDictLow).index(key)+1})

	#finnaly we sort dictionary by municipality names.
	dataDictObcineNamesSorted= sorted(dataDictObcine)
	finalSortedDict={}

	#to calculate contry average, we first  initiate dictionary
	avgOfSloveniaTmp={'hitrosti':{},'mejnehitrosti':{},'topponudnik':{},'tehnologije':{}}
	keysForCalcAvgOfSlo=['hitrosti','mejnehitrosti','topponudnik','tehnologije']

	#we add all the data that coresponds to key inside Country 
	for key in dataDictObcineNamesSorted:	
		finalSortedDict[key]=finalDict[key]
		for innerKey in keysForCalcAvgOfSlo:
			avgOfSloveniaTmp[innerKey]=dict(Counter(finalDict[key][innerKey])+Counter(avgOfSloveniaTmp[innerKey]))

	#we need to calculate length dictionary to iterate trough it
	lenOfDict=len(finalSortedDict)
	avgOfSlovenia={'hitrosti':{},'mejnehitrosti':{},'topponudnik':{},'tehnologije':{}}

	#we convert data to percentages
	for key in keysForCalcAvgOfSlo:
		for innerkey in avgOfSloveniaTmp[key]:
			if avgOfSloveniaTmp[key][innerkey]/lenOfDict > 2:
				avgOfSlovenia[key][innerkey]=round(avgOfSloveniaTmp[key][innerkey]/lenOfDict, 2)

	#at the end we need to add total average of whole county Slovenia and date of downloaded data.
	trueFinalSortedDict={}
	trueFinalSortedDict["Statistika celotne Slovenije"]=avgOfSlovenia
	trueFinalSortedDict.update(finalSortedDict)
	trueFinalSortedDict.update({"DATUM":datum})

	try:
		os.remove('data.json')
	except:
		pass
	#create file
	with open('data.json', 'w') as fp:
		json.dump(trueFinalSortedDict, fp)

	#quit()


if __name__=="__main__":
	parse_the_data()