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
#• Draw the x- and y-axis and the ticks and tick values. X
#• Display a legend that shows the categorical information. X 
#• Display the categorical information of the data points by using different shapes to represent the
#points.
#• Display the data points correctly for the axes.
#• Set the value range automatically based on the data values present in the data set.
# ---------------------------------------------------------------------------------------------------------

# Importera GUI toolkitet och Pandas (Pandas bara för csv läsning)
from tkinter import *
import tkinter as tk 
import pandas as pd # För att installera pandas skriv "pip install pandas" i terminalen 

# Läser in data
data1 = pd.read_csv('Infovis_task3\data1.csv', header=None)
data2 = pd.read_csv('Infovis_task3\data2.csv', header=None)

# Global variabel
CANVAS_WIDTH = 500*2
CANVAS_HEIGHT = 400*2

# vvvv Lägg till classer för allt här mellan! vvvv
# -----------------------------------------------------
def draw_axes(canvas, width, height):
    # Draw x-axis
    canvas.create_line(50, height - 50, width - 50, height - 50, width=2)

    # Draw ticks on the x-axis
    for x in range(100, width - 50, 100):
        canvas.create_line(x, height - 50, x, height - 45, width=2)
        canvas.create_text(x, height - 35, text=str(x), anchor=tk.N) # tk.N där N är north direction 

    # Draw y-axis
    canvas.create_line(50, height - 50, 50, 50, width=2)
    
    # Draw ticks on the y-axis
    for y in range(50, height - 50, 50):
        canvas.create_line(50, height - y, 55, height - y, width=2)
        canvas.create_text(35, height - y, text=str(y), anchor=tk.E) # tk.E där E är east direction

def checkered(canvas, line_distance):
   # vertical lines at an interval of "line_distance" pixel
   for x in range(line_distance,CANVAS_WIDTH,line_distance):
      canvas.create_line(x, 0, x, CANVAS_HEIGHT, fill="#476042")

   # horizontal lines at an interval of "line_distance" pixel
   for y in range(line_distance,CANVAS_HEIGHT,line_distance):
      canvas.create_line(0, y, CANVAS_WIDTH, y, fill="#476042")

def addLegend(canvas, width, height):
    legend_rect = canvas.create_rectangle((height * 1.2) , width * 0.05 , width * 0.7, height * 0.25,
                                outline = "black", width = 1)
    
    legend_text = canvas.create_text((width * 0.7 + height * 1.2) / 2, (height * 0.25 + width * 0.05) / 2,
                                     text="Legend Text", anchor=tk.CENTER)

    return legend_rect, legend_text
    

def plot_point(canvas, x, y):
    canvas.create_oval(x - 3, y - 3, x + 3, y + 3, fill="blue")

def main():
    main = Tk()
    main.title('Task 3 - InfoViz') #Window name 

    # Set the dimensions of the canvas

    # Create Canvas widget
    canvas = Canvas(main, width=CANVAS_WIDTH, height=CANVAS_HEIGHT, bg="white")
    canvas.pack()
    #checkered(canvas, 20) # påbörjat rutat nät ifall vi vill ha

    # Draw axes
    draw_axes(canvas, CANVAS_WIDTH, CANVAS_HEIGHT)

    legend_rect, legend_text = addLegend(canvas, CANVAS_WIDTH, CANVAS_HEIGHT)

    # Start the Tkinter event loop
    main.mainloop()

# -----------------------------------------------------
if __name__ == "__main__":
    main()


