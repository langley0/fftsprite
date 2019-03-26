class Sprite {
    getAbstractSpriteFromIso(iso, bool ignoreCache) {
        if (Context == PatcherLib.Datatypes.Context.US_PSX)
        {
            return GetAbstractSpriteFromPsxIso(iso, ignoreCache);
        }
        else if (Context == PatcherLib.Datatypes.Context.US_PSP)
        {
            return GetAbstractSpriteFromPspIso(iso, PatcherLib.Iso.PspIso.PspIsoInfo.GetPspIsoInfo(iso), ignoreCache);
        }
        else
        {
            return null;
        }
    }
}