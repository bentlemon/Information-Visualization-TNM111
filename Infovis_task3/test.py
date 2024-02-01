from tkinter import *
import tkinter as tk
import pandas as pd

# Läs in data
data = pd.read_csv('data1.csv', header=None)

# Beräkna mittpunkten av canvasen
CANVAS_WIDTH = 400
CANVAS_HEIGHT = 400
center_x = CANVAS_WIDTH / 2
center_y = CANVAS_HEIGHT / 2

def findHighestValue(data):
    max_X_value = data[0].max()
    max_Y_value = data[1].max()
    return max_X_value, max_Y_value

def findLowestValue(data):
    min_X_value = data[0].min()
    min_Y_value = data[1].min()
    return min_X_value, min_Y_value

def draw_axes(canvas, width, height):
    max_X_value, max_Y_value = findHighestValue(data)
    min_X_value, min_Y_value = findLowestValue(data)
    
    if (max_X_value > 0 and min_X_value > 0 and max_Y_value > 0 and min_Y_value > 0):
        canvas.create_line(50, height - 50, width - 50, height - 50, width=2)
        for x in range(int(min_X_value), int(max_X_value) + 1, 10):
            x_pixel = int((x - min_X_value) / (max_X_value - min_X_value) * (width - 100) + 50)
            canvas.create_line(x_pixel, height - 50, x_pixel, height - 45, width=2)
            canvas.create_text(x_pixel, height - 35, text=f"{x:.1f}", anchor=tk.N)

        canvas.create_line(50, height - 50, 50, 50, width=2)
        for y in range(int(min_Y_value + 1), int(max_Y_value) + 1, 10):
            y_pixel = int((y - min_Y_value) / (max_Y_value - min_Y_value) * (height - 100) + 50)
            canvas.create_line(50, height - y_pixel, 55, height - y_pixel, width=2)
            canvas.create_text(35, height - y_pixel, text=f"{y:.1f}", anchor=tk.E)

    elif (min_X_value < 0 or min_Y_value < 0):
        canvas.create_line(50, height/2, width - 50, height/2 , width=2)
        for x in range(int(min_X_value), int(max_X_value) + 1, 10):
            x_pixel = int((x - min_X_value) / (max_X_value - min_X_value) * (width - 100) + 50)
            canvas.create_line(x_pixel, height/2 , x_pixel, height/2 + 5, width=2)
            canvas.create_text(x_pixel, height/2 + 10, text=f"{x:.1f}", anchor=tk.N)

        canvas.create_line(width/2, height - 50, width/2, 50, width=2)
        for y in range(int(min_Y_value), int(max_Y_value) + 1, 10):
            y_pixel = int((y - min_Y_value) / (max_Y_value - min_Y_value) * (height - 100) + 50)
            canvas.create_line(width/2, height - y_pixel, width/2 - 5, height - y_pixel, width=2)
            canvas.create_text(width/2 - 10 , height - y_pixel, text=f"{y:.1f}", anchor=tk.E)

def plot_points(canvas):
    points = []
    for index, row in data.iterrows():
        x = row[0]
        y = row[1] 
        category = row[2]
        
        if category == 'a':
            points.append(canvas.create_polygon(center_x + x, center_y + y - 5, center_x + x - 5, center_y + y + 5, center_x + x + 5, center_y + y + 5, fill="red"))
        elif category == 'b': 
            points.append(canvas.create_polygon(center_x + x, center_y + y - 5, center_x + x + 5, center_y + y + 5, center_x + x - 5, center_y + y + 5, fill="green"))
        else:
            points.append(canvas.create_oval(center_x + x - 3, center_y + y - 3, center_x + x + 3, center_y + y + 3, fill="blue"))
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
    x = event.x - center_x
    y = event.y - center_y
    
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
    x = event.x - center_x
    y = event.y - center_y
    
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

if __name__ == "__main__":
    main()
