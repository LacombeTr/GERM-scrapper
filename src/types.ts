import { elementValues } from "./db/schema";

/**
 * Periodic table elements enum - atomic number to element symbol mapping
 */
export enum PeriodicElement {
    H = 1, // Hydrogen
    He = 2, // Helium
    Li = 3, // Lithium
    Be = 4, // Beryllium
    B = 5, // Boron
    C = 6, // Carbon
    N = 7, // Nitrogen
    O = 8, // Oxygen
    F = 9, // Fluorine
    Ne = 10, // Neon
    Na = 11, // Sodium
    Mg = 12, // Magnesium
    Al = 13, // Aluminum
    Si = 14, // Silicon
    P = 15, // Phosphorus
    S = 16, // Sulfur
    Cl = 17, // Chlorine
    Ar = 18, // Argon
    K = 19, // Potassium
    Ca = 20, // Calcium
    Sc = 21, // Scandium
    Ti = 22, // Titanium
    V = 23, // Vanadium
    Cr = 24, // Chromium
    Mn = 25, // Manganese
    Fe = 26, // Iron
    Co = 27, // Cobalt
    Ni = 28, // Nickel
    Cu = 29, // Copper
    Zn = 30, // Zinc
    Ga = 31, // Gallium
    Ge = 32, // Germanium
    As = 33, // Arsenic
    Se = 34, // Selenium
    Br = 35, // Bromine
    Kr = 36, // Krypton
    Rb = 37, // Rubidium
    Sr = 38, // Strontium
    Y = 39, // Yttrium
    Zr = 40, // Zirconium
    Nb = 41, // Niobium
    Mo = 42, // Molybdenum
    Tc = 43, // Technetium
    Ru = 44, // Ruthenium
    Rh = 45, // Rhodium
    Pd = 46, // Palladium
    Ag = 47, // Silver
    Cd = 48, // Cadmium
    In = 49, // Indium
    Sn = 50, // Tin
    Sb = 51, // Antimony
    Te = 52, // Tellurium
    I = 53, // Iodine
    Xe = 54, // Xenon
    Cs = 55, // Cesium
    Ba = 56, // Barium
    La = 57, // Lanthanum
    Ce = 58, // Cerium
    Pr = 59, // Praseodymium
    Nd = 60, // Neodymium
    Pm = 61, // Promethium
    Sm = 62, // Samarium
    Eu = 63, // Europium
    Gd = 64, // Gadolinium
    Tb = 65, // Terbium
    Dy = 66, // Dysprosium
    Ho = 67, // Holmium
    Er = 68, // Erbium
    Tm = 69, // Thulium
    Yb = 70, // Ytterbium
    Lu = 71, // Lutetium
    Hf = 72, // Hafnium
    Ta = 73, // Tantalum
    W = 74, // Tungsten
    Re = 75, // Rhenium
    Os = 76, // Osmium
    Ir = 77, // Iridium
    Pt = 78, // Platinum
    Au = 79, // Gold
    Hg = 80, // Mercury
    Tl = 81, // Thallium
    Pb = 82, // Lead
    Bi = 83, // Bismuth
    Po = 84, // Polonium
    At = 85, // Astatine
    Rn = 86, // Radon
    Fr = 87, // Francium
    Ra = 88, // Radium
    Ac = 89, // Actinium
    Th = 90, // Thorium
    Pa = 91, // Protactinium
    U = 92, // Uranium
}

/**
 * Type for element analysis values - inferred from database schema
 */
export type ElementValueSelect = typeof elementValues.$inferSelect;
export type ElementValueInsert = typeof elementValues.$inferInsert;

export type ElementValue = Omit<typeof elementValues.$inferSelect, "id"> & {
    id?: number;
};
