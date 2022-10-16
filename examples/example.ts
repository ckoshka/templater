import { Template } from "../template.ts";

const bioTemplate = Template(`Name: {{name}}; Favourite things: {{favs}}`, {});

const newTempl = bioTemplate.sub(
	"favs",
	`- musician: {{musician}}; - book: {{book}};`,
).setDefault({ name: "Patrick Bateman" });

newTempl.render({
	musician: "Huey Lewis and the News",
	book: "Atlas Shrugged",

});
// Name: Patrick Bateman; Favourite things: - musician: Huey Lewis and the News; - book: Atlas Shrugged;
