import os
import eyed3
import json

data = []

songNames = os.listdir('audio/')

for songName in songNames:
    audio = eyed3.load(f'audio/{songName}')
    print(audio)
    data.append({
        'name': songName,
        'title': audio.tag.title,
        'artist': audio.tag.artist,
        'album': audio.tag.album
    })

file = open('js/songs-list.js', 'w', encoding='UTF-8')

file.write("const songs = `" + json.dumps(data) + "`")
