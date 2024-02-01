from tkinter import *
import tkinter as tk
import pandas as pd

# Läs in data
data = pd.read_csv('data2.csv', header=None)

# Beräkna mittpunkten av canvasen
CANVAS_WIDTH = 600
CANVAS_HEIGHT = 600
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
    max_X_value, max_Y_value = findHighestValue(data)
    min_X_value, min_Y_value = findLowestValue(data)
    points = []
    for i, row in data.iterrows():
        x = row[0] 
        y = row[1]

        # Beräkna omvandlade x- och y-koordinater baserat på skalan för axlarna
        scaled_x = (x - min_X_value) / (max_X_value - min_X_value) * (CANVAS_WIDTH - 100) + 50
        scaled_y = CANVAS_HEIGHT - ((y - min_Y_value) / (max_Y_value - min_Y_value) * (CANVAS_HEIGHT - 100) + 50)

        category = row[2]
        
        if category == 'a' or category == 'foo':
            points.append(canvas.create_polygon(scaled_x, scaled_y - 5, scaled_x - 5, scaled_y + 5, scaled_x + 5, scaled_y + 5, fill="red"))
        elif category == 'b' or category == 'baz': 
            points.append(canvas.create_polygon(scaled_x, scaled_y - 5, scaled_x + 5, scaled_y + 5, scaled_x - 5, scaled_y + 5, fill="green"))
        else:
            points.append(canvas.create_oval(scaled_x - 3, scaled_y - 3, scaled_x + 3, scaled_y + 3, fill="blue"))
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

#             canvas.itemconfig(points[i], fill="black")
# def update_points(event, canvas, points):
#     x = event.x - center_x
#     y = event.y - center_y
#      # Hitta närmaste objekt till den punkt där vänsterklicket inträffade
#     closest_item = canvas.find_closest(event.x, event.y)
#     # Markerar den närmaste punkten (tex genom att ändra färgen)
#     canvas.itemconfig(closest_item, fill="yellow")  # Till exempel ändra färgen till röd
    
#     # selected_point_index = None
#     # for i, row in data.iterrows():
#     #      px = row[0] - x
#     #      py = row[1] - y
#     #      if abs(px) <= 10 and abs(py) <= 10:
#     #          selected_point_index = i
#     #          break
    
#     # Hämta koordinaterna för den valda punkten
#     selected_x, selected_y = canvas.coords(points[selected_point_index])[0], canvas.coords(points[selected_point_index])[1]
    
#     # Loopa genom alla punkter och ändra deras färg baserat på kvadranten relativt till den valda punkten
#     for i, row in data.iterrows():
#         px = row[0]
#         py = row[1]
#         quadrant = get_quadrant(selected_x, selected_y, px, py)
        
#         if i == selected_point_index:
#             canvas.itemconfig(points[i], fill="yellow")  # Ändra färgen på den valda punkten till gul först
#         elif quadrant == 1:
#             canvas.itemconfig(points[i], fill="red")
#         elif quadrant == 2:
#             canvas.itemconfig(points[i], fill="green")
#         elif quadrant == 3:
#             canvas.itemconfig(points[i], fill="purple")
#         elif quadrant == 4:
#             canvas.itemconfig(points[i], fill="black")

# def get_quadrant(x, y):
#     if x >= 0 and y >= 0:
#         return 1
#     elif x < 0 and y >= 0:
#         return 2
#     elif x < 0 and y < 0:
#         return 3
#     else:
#         return 4

# def update_points(event, canvas, points):
#     x = event.x - center_x
#     y = event.y - center_y
    
#     selected_point_index = None
#     for i, row in data.iterrows():
#         px = row[0] - x
#         py = row[1] - y
#         if abs(px) <= 10 and abs(py) <= 10:
#             selected_point_index = i
#             break
        
#     for i, row in data.iterrows():
#         px = row[0] - x
#         py = row[1] - y
#         quadrant = get_quadrant(px, py)
        
#         if i == selected_point_index:
#             canvas.itemconfig(points[i], fill="yellow")  # Ändra färgen på den valda punkten till gul först
#         elif quadrant == 1:
#             canvas.itemconfig(points[i], fill="red")
#         elif quadrant == 2:
#             canvas.itemconfig(points[i], fill="green")
#         elif quadrant == 3:
#             canvas.itemconfig(points[i], fill="purple")
#         elif quadrant == 4:
#             canvas.itemconfig(points[i], fill="black")

# def highlight_nearest_points(event, canvas, points):
#     x = event.x - center_x
#     y = event.y - center_y
    
#     selected_point_index = None
#     for i, row in data.iterrows():
#         px = row[0] - x
#         py = row[1] - y
#         if abs(px) <= 3 and abs(py) <= 3:
#             selected_point_index = i
#             break
    
#     if selected_point_index is not None:
#         distances = []
#         for i, row in data.iterrows():
#             if i != selected_point_index:
#                 dx = row[0] - data.iloc[selected_point_index, 0]
#                 dy = row[1] - data.iloc[selected_point_index, 1]
#                 distance = (dx ** 2 + dy ** 2) ** 0.5
#                 distances.append((i, distance))
        
#         nearest_points = sorted(distances, key=lambda x: x[1])[:5]
        
#         for index, _ in nearest_points:
#             canvas.itemconfig(points[index], fill="white")

def main():
    main = Tk()
    main.title('Task 3 - InfoViz')
   
    canvas = tk.Canvas(main, width=CANVAS_WIDTH, height=CANVAS_HEIGHT, bg="white")
    canvas.pack()

    draw_axes(canvas, CANVAS_WIDTH, CANVAS_HEIGHT)
    points = plot_points(canvas)
    
    canvas.bind("<Button-1>", lambda event: left_click(event, points))
    canvas.bind("<Button-3>", lambda event: highlight_nearest_points(event, points, canvas))

    #canvas.bind("<Button-3>", lambda event: highlight_nearest_points(event, canvas, points))
    #canvas.bind("<Button-1>", lambda event: update_points(event, canvas, points))
    

    main.mainloop()

if __name__ == "__main__":
    main()
