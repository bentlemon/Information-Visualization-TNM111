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
data = pd.read_csv('data1.csv', header=None) # Innehåller negativa värden
#data = pd.read_csv('data2.csv', header=None) # Innehåller bara positiva värden 

# Global variabel
CANVAS_WIDTH = 500
CANVAS_HEIGHT = 400

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
    # Finding the lowest/highest values to scale axis correctly
    max_X_value, max_Y_value = findHighestValue(data) # OK!
    min_X_value, min_Y_value = findLowestValue(data) # OK!

    # Check if displaying only positive x and y axes is sufficient

    if (max_X_value > 0 and min_X_value > 0 and max_Y_value > 0 and min_Y_value > 0):
        # Draw x-axis (positive x-axis)
        canvas.create_line(50, height - 50, width - 50, height - 50, width=2)

        # Draw ticks on the x-axis
        for x in range(int(min_X_value), int(max_X_value) + 1, 10):
            x_pixel = int((x - min_X_value) / (max_X_value - min_X_value) * (width - 100) + 50)
            canvas.create_line(x_pixel, height - 50, x_pixel, height - 45, width=2)
            canvas.create_text(x_pixel, height - 35, text=f"{x:.1f}", anchor=tk.N)

        # Draw y-axis (positive y-axis)
        canvas.create_line(50, height - 50, 50, 50, width=2)

        # Draw ticks on the y-axis
        for y in range(int(min_Y_value + 1), int(max_Y_value) + 1, 10):
            y_pixel = int((y - min_Y_value) / (max_Y_value - min_Y_value) * (height - 100) + 50)
            canvas.create_line(50, height - y_pixel, 55, height - y_pixel, width=2)
            canvas.create_text(35, height - y_pixel, text=f"{y:.1f}", anchor=tk.E)

    elif (min_X_value < 0 or min_Y_value < 0):
        # Draw x-axis (negative and positive)
        canvas.create_line(50, height/2, width - 50, height/2 , width=2)
        #                  x1,     y1,         x2,         y2

        # Draw ticks on the x-axis
        for x in range(int(min_X_value), int(max_X_value) + 1, 10):
            x_pixel = int((x - min_X_value) / (max_X_value - min_X_value) * (width - 100) + 50)
            canvas.create_line(x_pixel, height/2 , x_pixel, height/2 + 5, width=2)
            canvas.create_text(x_pixel, height/2 + 10, text=f"{x:.1f}", anchor=tk.N)

        # Draw y-axis (negative and positive)
        canvas.create_line(width/2, height - 50, width/2, 50, width=2)
        #                  x1,         y1,         x2,    y2

        # Draw ticks on the y-axis
        for y in range(int(min_Y_value), int(max_Y_value) + 1, 10):
            y_pixel = int((y - min_Y_value) / (max_Y_value - min_Y_value) * (height - 100) + 50)
            canvas.create_line(width/2, height - y_pixel, width/2 - 5, height - y_pixel, width=2)
            canvas.create_text(width/2 - 10 , height - y_pixel, text=f"{y:.1f}", anchor=tk.E)


def addLegend(canvas, width, height):
    legend_rect = canvas.create_rectangle((height * 1.2) , width * 0.05 , width * 0.7, height * 0.25,
                                outline = "black", width = 1)
    
    legend_text = canvas.create_text((width * 0.7 + height * 1.2) / 2, (height * 0.25 + width * 0.05) / 2,
                                     text="Legend Text", anchor=tk.CENTER)

    return legend_rect, legend_text

# Function to handle mouse click events
# Left click
def handle_click_left(event):
    global selected_point, new_origin
    x_value, y_value = event.x_value, event.y_value

       # Check if any data point is clicked
    for i, (px, py) in enumerate(data):
        if px - 5 <= x_value <= px + 5 and py - 5 <= y_value <= py + 5:
            if selected_point == i:
                # Toggle new grid system off
                new_origin = None
                selected_point = None
            else:
                # Toggle new grid system on with the selected point as the new origin
                new_origin = data[i]
                selected_point = i
            draw_visualization()

# Check is any data point is clicked
def draw_visualization():
    for i, (x, y) in enumerate(data):
        # Determine color based on quadrant
        color = "red" if (x < new_origin[0] and y < new_origin[1]) else \
                "green" if (x < new_origin[0] and y > new_origin[1]) else \
                "blue" if (x > new_origin[0] and y < new_origin[1]) else \
                "yellow"
        
    
    


def plot_point(canvas, x, y, category, min_x, max_x, min_y, max_y, canvas_width, canvas_height):
    # Calculate the scaling factors for x and y coordinates
    x_scale = canvas_width / (max_x - min_x)
    y_scale = canvas_height / (max_y - min_y)

    # Scale the data coordinates to fit within the canvas
    canvas_x = (x - min_x) * x_scale
    canvas_y = canvas_height - (y - min_y) * y_scale

    # Check if the point falls within the canvas boundaries
    if 0 <= canvas_x <= canvas_width and 0 <= canvas_y <= canvas_height:
        # Plot the point only if it falls within the canvas
        if category == 'a':
            canvas.create_rectangle(canvas_x-5, canvas_y-5, canvas_x+5, canvas_y+5, fill='red')  # Example: Red line for category A
        elif category == 'b':
            canvas.create_oval(canvas_x - 5, canvas_y - 5, canvas_x + 5, canvas_y + 5, fill='blue')  # Example: Blue circle for category B
        else:
            canvas.create_polygon(canvas_x, canvas_y - 5, canvas_x + 5, canvas_y + 5, canvas_x - 5, canvas_y + 5, fill='green')  # Example: Green triangle for other categories


   

def main():
    main = Tk()
    main.title('Task 3 - InfoViz') #Window name 

    # Create Canvas widget
    canvas = Canvas(main, width=CANVAS_WIDTH, height=CANVAS_HEIGHT, bg="white")
    canvas.pack()

    min_x, max_x = findLowestValue(data)[0], findHighestValue(data)[0]
    min_y, max_y = findLowestValue(data)[1], findHighestValue(data)[1]
    # Draw axes with scaling correctly for the min and max values in the data sets
    draw_axes(canvas, CANVAS_WIDTH, CANVAS_HEIGHT)

     # För varje datapunkt i din data
    for index, row in data.iterrows():
        x_value = row[0]  # x-värdet för aktuell datapunkt
        y_value = row[1]  # y-värdet för aktuell datapunkt
        category = row[2]  # Kategorin för aktuell datapunkt
        plot_point(canvas, x_value, y_value, category, min_x, max_x, min_y, max_y, CANVAS_WIDTH, CANVAS_HEIGHT)

    # Draw axes with scaling correctly for the min and max values in the data sets
    draw_axes(canvas, CANVAS_WIDTH, CANVAS_HEIGHT)

    legend_rect, legend_text = addLegend(canvas, CANVAS_WIDTH, CANVAS_HEIGHT)

    # Start the Tkinter event loop
    main.mainloop()

# -----------------------------------------------------
if __name__ == "__main__":
    main()


