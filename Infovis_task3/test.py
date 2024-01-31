import tkinter as tk
import pandas as pd

# Läs in data
data = pd.read_csv("data2.csv")

# Beräkna mittpunkten av canvasen
canvas_width = 400
canvas_height = 400
center_x = canvas_width / 2
center_y = canvas_height / 2

# Skapa en tkinter-applikation
root = tk.Tk()

# Skapa en Canvas för att rita punkterna
canvas = tk.Canvas(root, width=canvas_width, height=canvas_height)
canvas.pack()

# Rita punkterna relativt centrum
points = []
for index, row in data.iterrows():
    x = row[0]
    y = row[1] 
    category = row[2]
    
    if category == 'a':
        # Skapa en triangel för punkten
        points.append(canvas.create_polygon(center_x + x, center_y + y - 5, center_x + x - 5, center_y + y + 5, center_x + x + 5, center_y + y + 5,
            fill="red"))
    elif category == 'b': 
        points.append(canvas.create_polygon(center_x + x, center_y + y - 5, center_x + x + 5, center_y + y + 5, center_x + x - 5, center_y + y + 5,
            fill="green"
        ))
    else:
        # Skapa en oval för punkten
        points.append(canvas.create_oval(center_x + x - 3, center_y + y - 3, center_x + x + 3, center_y + y + 3, fill="blue"))


def get_quadrant(x, y):
    if x >= 0 and y >= 0:
        return 1
    elif x < 0 and y >= 0:
        return 2
    elif x < 0 and y < 0:
        return 3
    else:
        return 4
    
def update_points(event):
    # Hämta x- och y-koordinater för den valda punkten
    x = event.x - center_x  # Justera x-koordinaten relativt centrum
    y = event.y - center_y  # Justera y-koordinaten relativt centrum
    
    # Kontrollera om musklicket inträffade på punkten
    selected_point_index = None
    for i, row in data.iterrows():
        px = row[0] - x  # Justera x-koordinaten relativt den valda punkten
        py = row[1] - y  # Justera y-koordinaten relativt den valda punkten
        if abs(px) <= 3 and abs(py) <= 3:
            selected_point_index = i
            break
    
    # Uppdatera färg för alla punkter baserat på deras kvadrant i förhållande till den valda punkten
    for i, row in data.iterrows():
        px = row[0] - x  # Justera x-koordinaten relativt den valda punkten
        py = row[1] - y  # Justera y-koordinaten relativt den valda punkten
        quadrant = get_quadrant(px, py)
        
        if i == selected_point_index:
            canvas.itemconfig(points[i], fill="yellow")  # Ändra färgen på den valda punkten till gul
        elif quadrant == 1:
            canvas.itemconfig(points[i], fill="red")
        elif quadrant == 2:
            canvas.itemconfig(points[i], fill="orange")
        elif quadrant == 3:
            canvas.itemconfig(points[i], fill="purple")
        elif quadrant == 4:
            canvas.itemconfig(points[i], fill="black")

def highlight_nearest_points(event):
    # Hämta x- och y-koordinater för musklicket
    x = event.x - center_x  # Justera x-koordinaten relativt centrum
    y = event.y - center_y  # Justera y-koordinaten relativt centrum
    
    # Kontrollera om musklicket inträffade på någon av punkterna
    selected_point_index = None
    for i, row in data.iterrows():
        px = row[0] - x  # Justera x-koordinaten relativt den valda punkten
        py = row[1] - y  # Justera y-koordinaten relativt den valda punkten
        if abs(px) <= 3 and abs(py) <= 3:
            selected_point_index = i
            break
    
    if selected_point_index is not None:
        # Markera de fem närmaste punkterna med färgen vitt
        distances = []  # Lista för att lagra avstånden till alla punkter
        for i, row in data.iterrows():
            if i != selected_point_index:  # Undvik att jämföra med den valda punkten själv
                dx = row[0] - data.iloc[selected_point_index, 0]  # Skillnaden i x-koordinat
                dy = row[1] - data.iloc[selected_point_index, 1]  # Skillnaden i y-koordinat
                distance = (dx ** 2 + dy ** 2) ** 0.5  # Euklidiskt avstånd
                distances.append((i, distance))  # Lägg till index och avstånd i listan
        
        # Sortera listan efter avstånd och välj de fem närmaste punkterna
        nearest_points = sorted(distances, key=lambda x: x[1])[:5]
        
        # Markera de närmaste punkterna med färgen vitt
        for index, _ in nearest_points:
            canvas.itemconfig(points[index], fill="white")

# Lägg till en eventlyssnare för att få musklicksposition
canvas.bind("<Button-3>", highlight_nearest_points)

# Lägg till en eventlyssnare för att få musklicksposition
canvas.bind("<Button-1>", update_points)

# Starta tkinter-huvudloopen
root.mainloop()
