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
# • Display a legend that shows the categorical information. X
# • Display the categorical information of the data points by using different shapes to represent the
#   points. X
# • Display the data points correctly for the axes. X
# • Set the value range automatically based on the data values present in the data set. X

# INSTRUCTIONS PART 2: 
# After implementing the basic scatter plot, you should also add the following two features when interacting with a data point:

# • When left-clicking with the mouse on a data point, a new grid system will be used where the selected point will become the new
#  origin. The other points should get distinct colors depending on which quadrants they are located in. This new grid system is 
#  deactivated when the user left-clicks on the selected point again. Do not forget to mark the selected point somehow, e.g., 
#  stroke or highlight around the shape. X

# • When right-clicking with the mouse (or by using any other interaction of your choice, e.g., ctrl+left-click) on a data point,
#   the nearest five geometrically neighboring points, based on Euclidean distance, will be highlighted with a color of your choice.
#   This feature will be deactivated when the user right-clicks on the selected point again.
# ---------------------------------------------------------------------------------------------------------

# Importera GUI toolkitet och Pandas (Pandas bara för csv läsning)
from tkinter import *
import tkinter as tk 
import pandas as pd # För att installera pandas skriv "pip install pandas" i terminalen 

# Läser in data, kommentera ut den datan du inte vill visa. Går bara att ha en data i taget!
#data = pd.read_csv('Infovis_task3\data1.csv', header=None) # Innehåller positiva och negativa värden
data = pd.read_csv('Infovis_task3\data2.csv', header=None) # Innehåller bara positiva värden 

# Global variables
CANVAS_WIDTH = 600
CANVAS_HEIGHT = 600
CENTER_X = CANVAS_WIDTH / 2
CENTER_Y = CANVAS_HEIGHT / 2

# vvvv Lägg till funktioner för allt här mellan! vvvv
# -----------------------------------------------------
def checkWhichData(data):
    data1 = pd.read_csv('Infovis_task3\data1.csv', header=None)
    if data.equals(data1):
        return True
    else:
        return False

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

def addLegend(canvas):
    # Create the first rectangle
    legend_rect = canvas.create_rectangle(CANVAS_HEIGHT - 5, CANVAS_WIDTH * 0.1, CANVAS_WIDTH * 0.75 , CANVAS_HEIGHT * 0.25,
                                          outline="gray", width=1)

    # Get the coordinates of the first rectangle
    x1, y1, x2, y2 = canvas.coords(legend_rect)

    # Change the text for the legend so it matches the data
    if (checkWhichData(data)):
        circle_text = "a"
        triangle_text = "b"
        square_text = "c"
    else:
        circle_text = "foo"
        triangle_text = "baz"
        square_text = "bar"

    canvas.create_oval(x1 + 10, y1 + 10, (x2+x1)/2 - 45, (y2-y1) - 5, fill="blue") # Symbol for 'c' and 'bar'
    canvas.create_text((x2 + x1) / 2 - 30, (y2 - y1) / 2 + 30, text=circle_text, anchor="w")


    canvas.create_polygon(x1 + 18.5, y1 + 35,  (x2+x1)/2 - 65,  y2 - 35, 
                                       x2 - 115.2, (y2-y1) + 25, outline = "black",fill="green")
    canvas.create_text(
        (x2 + x1) / 2 - 30, (y2 - y1) / 2 + 60, text=triangle_text, anchor="w"
    )
    
    canvas.create_rectangle(x1 + 10, y1 + 70, (x2+x1)/2 - 45,  (y2-y1) + 55 ,  outline = "black", fill="red")
    canvas.create_text(
        (x2 + x1) / 2 - 30, (y2 - y1) / 2 + 90, text=square_text, anchor="w"
    )

def plot_points(canvas):
    points = []
    max_X_value, max_Y_value = findHighestValue(data)
    min_X_value, min_Y_value = findLowestValue(data)

    for index, row in data.iterrows():
        x = row[0]
        y = row[1] 
        category = row[2]

        # Re-scaled the x and y coordinates to fit the scaled axes
        scaled_x = (x - min_X_value) / (max_X_value - min_X_value) * (CANVAS_WIDTH - 100) + 50
        scaled_y = CANVAS_HEIGHT - ((y - min_Y_value) / (max_Y_value - min_Y_value) * (CANVAS_HEIGHT - 100) + 50)
        
        if category == 'a' or category == 'foo':
            points.append(canvas.create_oval(scaled_x - 3, scaled_y - 3, scaled_x + 3, scaled_y + 3, fill="blue"))
        elif category == 'b' or category == 'baz': 
            points.append(canvas.create_polygon(scaled_x, scaled_y - 5, scaled_x + 5, scaled_y + 5, scaled_x - 5, scaled_y + 5, fill="green"))
        else:
            points.append(canvas.create_rectangle(scaled_x, scaled_y, scaled_x - 5, scaled_y + 5,fill="red"))
    return points

def get_quadrant(selected_x, selected_y, x, y):
    if x >= selected_x and y >= selected_y:
        return 1
    elif x < selected_x and y >= selected_y:
        return 2
    elif x < selected_x and y < selected_y:
        return 3
    else:
        return 4

def left_click(event, points):
    selected_x, selected_y = event.x, event.y
    
    # Hitta det objekt som händelsen inträffade på
    selected_item = event.widget.find_closest(event.x, event.y)[0]
    
    # Hämta koordinaterna för den valda punkten
    selected_point_coords = event.widget.coords(selected_item)
    selected_x, selected_y = (selected_point_coords[0] + selected_point_coords[2]) / 2, (selected_point_coords[1] + selected_point_coords[3]) / 2
    
    # Loopa genom alla punkter och ändra deras färg baserat på kvadranten relativt till den valda punkten
    for point in points:
        point_coords = event.widget.coords(point)
        point_x, point_y = (point_coords[0] + point_coords[2]) / 2, (point_coords[1] + point_coords[3]) / 2
        distance = ((point_x - selected_x)**2 + (point_y - selected_y)**2)**0.5
         # Om avståndet är mindre än den angivna gränsen, fyll i punkten med gul
        if distance <= 5:  
            event.widget.itemconfigure(point, fill="yellow")
        else:
            # Annars, ändra punktens färg baserat på dess kvadrant relativt till den valda punkten
            quadrant = get_quadrant(selected_x, selected_y, point_x, point_y)
            if quadrant == 1:
                event.widget.itemconfig(point, fill="red")
            elif quadrant == 2:
                event.widget.itemconfig(point, fill="green")
            elif quadrant == 3:
                event.widget.itemconfig(point, fill="purple")
            elif quadrant == 4:
                event.widget.itemconfig(point, fill="black")

# Fixa highlighning och reset funktion 
def highlight_nearest_points(event, points, canvas):
    selected_item = event.widget.find_closest(event.x, event.y)[0]
    selected_point_coords = event.widget.coords(selected_item)
    selected_x, selected_y = (selected_point_coords[0] + selected_point_coords[2]) / 2, (selected_point_coords[1] + selected_point_coords[3]) / 2
    
    distances = []
    
    for point in points:
        point_coords = canvas.coords(point)
        point_x, point_y = (point_coords[0] + point_coords[2]) / 2, (point_coords[1] + point_coords[3]) / 2
        distance = ((selected_x - point_x)**2 + (selected_y - point_y)**2)**0.5
        distances.append((point, distance))
    distances.sort(key=lambda x: x[1])
    nearest_points = [point[0] for point in distances[:6]]
    
    # Toggle color of nearest points between pink and yellow
    for point in points:
        if point in nearest_points and point != selected_item:
            event.widget.itemconfigure(point, fill="pink")

def main():
    main = Tk()
    main.title('Task 3 - InfoViz')
   
    canvas = tk.Canvas(main, width=CANVAS_WIDTH, height=CANVAS_HEIGHT, bg="white")
    canvas.pack()

    addLegend(canvas)
    draw_axes(canvas, CANVAS_WIDTH, CANVAS_HEIGHT)
    
    points = plot_points(canvas)
    
    canvas.bind("<Button-1>", lambda event: left_click(event, points))
    canvas.bind("<Button-3>", lambda event: highlight_nearest_points(event, points, canvas))
    
    main.mainloop()

# -----------------------------------------------------
# Initialization code     
if __name__ == "__main__":
    main()
