"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LandingPage;
const Hero_1 = __importDefault(require("../../components/landing/Hero"));
const Features_1 = __importDefault(require("../../components/landing/Features"));
const Footer_1 = __importDefault(require("../../components/landing/Footer"));
function LandingPage() {
    return (<main className="bg-[#fafbf8] font-sans text-[#141b0e]">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-20 py-10">
        <Hero_1.default />
        <Features_1.default />
        <Footer_1.default />
      </div>
    </main>);
}
