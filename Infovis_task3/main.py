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
# ---------------------------------------------------------------------------------------------------------

# Importera GUI toolkitet och Pandas (Pandas bara för csv läsning)
from tkinter import * 
import pandas as pd # För att installera pandas skriv "pip install pandas" i terminalen 

# Läser in data
data1 = pd.read_csv('Infovis_task3\data1.csv', header=None)
data2 = pd.read_csv('Infovis_task3\data2.csv', header=None)

# vvvv Lägg till classer för allt här mellan! vvvv
# -----------------------------------------------------
def draw_axes(canvas, width, height):
    # Draw x-axis
    canvas.create_line(50, height - 50, width - 50, height - 50, width=2)

    # Draw y-axis
    canvas.create_line(50, height - 50, 50, 50, width=2)


def plot_point(canvas, x, y):
    canvas.create_oval(x - 3, y - 3, x + 3, y + 3, fill="blue")

def main():
    main = Tk()
    main.title('Task 3 - InfoViz') #Window name 
    # Set the dimensions of the canvas
    width = 500
    height = 400

    # Create Canvas widget
    canvas = Canvas(main, width=width, height=height, bg="white")
    canvas.pack()

    # Draw axes
    draw_axes(canvas, width, height)

    # Start the Tkinter event loop
    main.mainloop()

# -----------------------------------------------------
if __name__ == "__main__":
    main()


