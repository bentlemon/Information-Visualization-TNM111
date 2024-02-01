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
# • Draw the x- and y-axis and the ticks and tick values. X
# • Display a legend that shows the categorical information. SKA GÖRAS
# • Display the categorical information of the data points by using different shapes to represent the
#   points. X
# • Display the data points correctly for the axes. X
# • Set the value range automatically based on the data values present in the data set. X

# INSTRUCTIONS PART 2: 
# After implementing the basic scatter plot, you should also add the following two features when interacting with a data point:

# • When left-clicking with the mouse on a data point, a new grid system will be used where the selected point will become the new
#  origin. The other points should get distinct colors depending on which quadrants they are located in. This new grid system is 
#  deactivated when the user left-clicks on the selected point again. Do not forget to mark the selected point somehow, e.g., 
#  stroke or highlight around the shape.

# • When right-clicking with the mouse (or by using any other interaction of your choice, e.g., ctrl+left-click) on a data point,
#   the nearest five geometrically neighboring points, based on Euclidean distance, will be highlighted with a color of your choice.
#   This feature will be deactivated when the user right-clicks on the selected point again.
# ---------------------------------------------------------------------------------------------------------

# Importera GUI toolkitet och Pandas (Pandas bara för csv läsning)
from tkinter import *
import tkinter as tk 
import pandas as pd # För att installera pandas skriv "pip install pandas" i terminalen 

# Läser in data
data = pd.read_csv('Infovis_task3\data1.csv', header=None) # Innehåller negativa värden
#data = pd.read_csv('data2.csv', header=None) # Innehåller bara positiva värden 

# Global variables
CANVAS_WIDTH = 500
CANVAS_HEIGHT = 400
CENTER_X = CANVAS_WIDTH / 2
CENTER_Y = CANVAS_HEIGHT / 2

# vvvv Lägg till funktioner för allt här mellan! vvvv
# -----------------------------------------------------
def findHighestValue(data):
    
    # col 1 är X, col 2 är Y
    max_X_value = data[0].max()
    max_Y_value = data[1].max()

    return max_X_value, max_Y_value

def findLowestValue(data):
    
    # col 1 är X, col 2 är Y
    min_X_value = data[0].min()
    min_Y_value = data[1].min()

    return min_X_value, min_Y_value

def draw_axes(canvas, width, height):
    max_X_value, max_Y_value = findHighestValue(data)
    min_X_value, min_Y_value = findLowestValue(data)
    
    if (max_X_value > 0 and min_X_value > 0 and max_Y_value > 0 and min_Y_value > 0): # For one quadrant (only positive values)
        canvas.create_line(50, height - 50, width - 50, height - 50, width=2) # x-axis
        for x in range(int(min_X_value), int(max_X_value) + 1, 10):
            x_pixel = int((x - min_X_value) / (max_X_value - min_X_value) * (width - 100) + 50)
            canvas.create_line(x_pixel, height - 50, x_pixel, height - 45, width=2) # x-axis ticks
            canvas.create_text(x_pixel, height - 35, text=f"{x:.1f}", anchor=tk.N)

        canvas.create_line(50, height - 50, 50, 50, width=2)
        for y in range(int(min_Y_value + 1), int(max_Y_value) + 1, 10): # y-axis
            y_pixel = int((y - min_Y_value) / (max_Y_value - min_Y_value) * (height - 100) + 50)
            canvas.create_line(50, height - y_pixel, 55, height - y_pixel, width=2) # y-axis ticks
            canvas.create_text(35, height - y_pixel, text=f"{y:.1f}", anchor=tk.E)

    elif (min_X_value < 0 or min_Y_value < 0): # For 4 quadrant (pos. and neg. values)
        canvas.create_line(50, height/2, width - 50, height/2 , width=2) # x-axis
        for x in range(int(min_X_value), int(max_X_value) + 1, 10):
            x_pixel = int((x - min_X_value) / (max_X_value - min_X_value) * (width - 100) + 50)
            canvas.create_line(x_pixel, height/2 , x_pixel, height/2 + 5, width=2) # x-axis ticks
            canvas.create_text(x_pixel, height/2 + 10, text=f"{x:.1f}", anchor=tk.N)

        canvas.create_line(width/2, height - 50, width/2, 50, width=2)
        for y in range(int(min_Y_value), int(max_Y_value) + 1, 10): # y-axis
            y_pixel = int((y - min_Y_value) / (max_Y_value - min_Y_value) * (height - 100) + 50)
            canvas.create_line(width/2, height - y_pixel, width/2 - 5, height - y_pixel, width=2) # y-axis ticks
            canvas.create_text(width/2 - 10 , height - y_pixel, text=f"{y:.1f}", anchor=tk.E)

def addLegend(canvas, width, height):
    legend_rect = canvas.create_rectangle((height * 1.2) , width * 0.05 , width * 0.7, height * 0.25,
                                outline = "black", width = 1)
    
    legend_text = canvas.create_text((width * 0.7 + height * 1.2) / 2, (height * 0.25 + width * 0.05) / 2,
                                     text="Legend Text", anchor=tk.CENTER)

    return legend_rect, legend_text

def plot_points(canvas):
    points = []
    for index, row in data.iterrows():
        x = row[0]
        y = row[1] 
        category = row[2]
        
        if category == 'a':
            points.append(canvas.create_polygon(CENTER_X + x, CENTER_Y + y - 5, CENTER_X + x - 5, CENTER_Y + y + 5, CENTER_X + x + 5, CENTER_Y + y + 5, fill="red"))
        elif category == 'b': 
            points.append(canvas.create_polygon(CENTER_X + x, CENTER_Y + y - 5, CENTER_X + x + 5, CENTER_Y + y + 5, CENTER_X + x - 5, CENTER_Y + y + 5, fill="green"))
        else:
            points.append(canvas.create_oval(CENTER_X + x - 3, CENTER_Y + y - 3, CENTER_X + x + 3, CENTER_Y + y + 3, fill="blue"))
    return points

def get_quadrant(x, y):
    if x >= 0 and y >= 0:
        return 1
    elif x < 0 and y >= 0:
        return 2
    elif x < 0 and y < 0:
        return 3
    else:
        return 4
    
def update_points(event, canvas, points):
    x = event.x - CENTER_X
    y = event.y - CENTER_Y
    
    selected_point_index = None
    for i, row in data.iterrows():
        px = row[0] - x
        py = row[1] - y
        if abs(px) <= 3 and abs(py) <= 3:
            selected_point_index = i
            break
    
    for i, row in data.iterrows():
        px = row[0] - x
        py = row[1] - y
        quadrant = get_quadrant(px, py)
        
        if i == selected_point_index:
            canvas.itemconfig(points[i], fill="yellow")
        elif quadrant == 1:
            canvas.itemconfig(points[i], fill="red")
        elif quadrant == 2:
            canvas.itemconfig(points[i], fill="orange")
        elif quadrant == 3:
            canvas.itemconfig(points[i], fill="purple")
        elif quadrant == 4:
            canvas.itemconfig(points[i], fill="black")

def highlight_nearest_points(event, canvas, points):
    x = event.x - CENTER_X
    y = event.y - CENTER_Y
    
    selected_point_index = None
    for i, row in data.iterrows():
        px = row[0] - x
        py = row[1] - y
        if abs(px) <= 3 and abs(py) <= 3:
            selected_point_index = i
            break
    
    if selected_point_index is not None:
        distances = []
        for i, row in data.iterrows():
            if i != selected_point_index:
                dx = row[0] - data.iloc[selected_point_index, 0]
                dy = row[1] - data.iloc[selected_point_index, 1]
                distance = (dx ** 2 + dy ** 2) ** 0.5
                distances.append((i, distance))
        
        nearest_points = sorted(distances, key=lambda x: x[1])[:5]
        
        for index, _ in nearest_points:
            canvas.itemconfig(points[index], fill="white")

def main():
    main = Tk()
    main.title('Task 3 - InfoViz')
   
    canvas = tk.Canvas(main, width=CANVAS_WIDTH, height=CANVAS_HEIGHT, bg="white")
    canvas.pack()

    draw_axes(canvas, CANVAS_WIDTH, CANVAS_HEIGHT)
    points = plot_points(canvas)
    
    canvas.bind("<Button-3>", lambda event: highlight_nearest_points(event, canvas, points))
    canvas.bind("<Button-1>", lambda event: update_points(event, canvas, points))
    
    main.mainloop()

# -----------------------------------------------------
    
if __name__ == "__main__":
    main()


