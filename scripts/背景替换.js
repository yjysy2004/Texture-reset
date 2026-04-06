//感谢神魂
importPackage(Packages.mindustry.graphics)

Events.on(EventType.ClientLoadEvent, () => {
const loadren = extend(MenuRenderer, {
    render(){
    Draw.color();
Draw.rect(Core.atlas.find("Texture-reset-(打出你想放入的背景图并删除括号里面的字，以及括住这行字的括号)"), Core.graphics.getWidth() / 2, Core.graphics.getHeight() / 2, 2000, 1000);
    }
})
function Class(id) {
	return Seq([id]).get(0)
}
var fi = Class(MenuFragment).getDeclaredField("renderer");
fi.setAccessible(true);
fi.set(Vars.ui.menufrag, loadren);
})