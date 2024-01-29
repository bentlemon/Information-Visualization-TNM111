# BORDE BARA VARA ATT KÖRA!!! Det som jag skriver här efter är om man behöver göra ett nytt projekt
#När man är i "Infovis_task3" foldern skriv: .venv\Scripts \ a ctivate i cmd för att få den att aktivera 
#virtuella miljön (virtual enviroment). Är korrekt om det står: (.venv) C:\Users\mahon\Desktop\Infovis_task3> i terminalen
#Jag följde 2 olika tutorials: 
#https://www.youtube.com/watch?v=GrAYoJUQolo (för att starta upp miljön)
#https://code.visualstudio.com/docs/python/environments (För att få igång python)

#INSTRUCTIONS PART 1:
#Your application should be able to load and visualize the data sets found in the “Assignment 2” folder
#on Lisam. Your visualization tool should at least be able to:
#
#• Draw the x- and y-axis and the ticks and tick values.
#• Display a legend that shows the categorical information.
#• Display the categorical information of the data points by using different shapes to represent the
#points.
#• Display the data points correctly for the axes.
#• Set the value range automatically based on the data values present in the data set.

# Importera GUI toolkitet  
from tkinter import *
# Får importerea cvs readers! För att installera pandas skriv "pip install pandas" i terminalen 
import pandas as pd

# Läser in data
data1 = pd.read_csv('Infovis_task3\data1.csv', header=None)
data2 = pd.read_csv('Infovis_task3\data2.csv', header=None)
#print(data1) # test! Allt ser ok ut från läsningen!

main = Tk()
main.title('Task 3') #Window name
# Lägg till widgets här mellan!
# -----------------------------




button = Button(main, text='Stop', width=25, command=main.destroy)
button.pack()
# -----------------------------

main.mainloop()
