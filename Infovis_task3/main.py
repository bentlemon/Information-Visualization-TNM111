# BORDE BARA VARA ATT KÖRA!!! Det som jag skriver här efter är om man behöver göra ett nytt projekt
# När man är i "Infovis_task3" foldern skriv: .venv\Scripts\activate i cmd för att få den att aktivera 
# virtuella miljön (virtual enviroment). Är korrekt om det står: (.venv) C:\Users\mahon\Desktop\Infovis_task3> i terminalen
# Jag följde 2 olika tutorials: 
# https://www.youtube.com/watch?v=GrAYoJUQolo (för att starta upp miljön)
# https://code.visualstudio.com/docs/python/environments (För att få igång python)

# Importera GUI toolkitet  
from tkinter import *

# Lägg till widgets här mellan! 
# -----------------------------
main = Tk()
main.title('Task 3') #Window name
button = Button(main, text='Stop', width=25, command=main.destroy)

button.pack()
# -----------------------------

main.mainloop()
