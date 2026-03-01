# Ai Hoshino Fan Page Music

Edit `ai-hoshino-music-config.js` to control music used in Ai Hoshino Fan Page mode.

## Where to add songs
- Put your audio files in `assets/music/ai-hoshino/` (or any path inside the project).

## How to register songs
- Open `ai-hoshino-music-config.js`.
- Add entries to `playlist`:

```js
{ title: "My Track Name", src: "assets/music/ai-hoshino/my-track.mp3" }
```

## Notes
- `autoplayOnMode: true` means the playlist starts when Ai Hoshino Fan Page mode is enabled and music is on.
- If `playlist` is empty, the site falls back to the default SMP playlist.
