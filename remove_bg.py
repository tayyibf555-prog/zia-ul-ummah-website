from PIL import Image

def remove_bg(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    # If the pixel is dark (e.g. RGB < 50 for all channels), make it transparent
    for item in datas:
        # Check against blackish colors
        if item[0] < 50 and item[1] < 50 and item[2] < 50:
            newData.append((0, 0, 0, 0)) # fully transparent
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")

remove_bg('/Users/tayyibarbab/.gemini/antigravity/brain/53d31cf6-dad6-44bf-9c6c-19e6362ca123/media__1771808251770.png', '/Users/tayyibarbab/Downloads/claude code test/zia ul ummah website/logo-transparent.png')
