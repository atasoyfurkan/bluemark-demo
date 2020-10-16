import React, { Component } from "react";
import { firestore, fireauth } from "../Firestore";
import Header from "../components/Header";
import EvalCard from "../components/EvalCard";
import { notify } from "react-notify-bootstrap"
import KatilimciCard from "../components/KatilimciCard";
import FinishedCard from "../components/FinishedCard";
import GorusCard from "../components/GorusCard";

class GunlukYoklama extends Component {
    state = {
        score: 1,
        katilimcilar: [],
        seciliKatilimci: null,
        egitimTarih: null,
        questionNumber: -1,
        cevaplar: [0, 0, 0, 0, 0, 0, 0, 0]
    };
    questions = [
        "Eğitim, genel olarak beklentilerimi karşılayacak düzeydeydi.",
        "Eğitimin içeriği amacına uygun şekilde hazırlanmıştı.",
        "Eğitimde verilen örnekler ve uygulamalar öğrenimime yardımcı oldu.",
        "Eğitmenin bilgisi ve konuya hakimiyeti iyiydi.",
        "Eğitmen sorulara tatmin edici cevaplar verdi.",
        "Eğitmen eğitim için hazırlıklıydı.",
        "Kullanılan salon, oturma düzeni ve alanlar eğitim için uygundu.",
        "Eğitim ortamı, temiz ve düzenliydi.",
    ]
    async componentDidMount() {
        if (!fireauth.currentUser)
            await fireauth.signInAnonymously()

        this.getKatilimci();
        const egitim = await firestore
            .collection("egitim")
            .doc(this.props.match.params.id)
            .get();
        this.setState({ egitimTarih: egitim.data().tarih });
    }

    getKatilimci = () => {
        firestore.collection("katilimci").where("egitimId", "==", this.props.match.params.id).onSnapshot(snapshot => {
            let arr = [];
            snapshot.forEach(val => {
                if (val.data().egitimId === this.props.match.params.id)
                    arr.push({ ...val.data(), id: val.id });
            });
            this.setState({ katilimcilar: arr });
        });
    };

    next = async _ => {
        try {
            let katilimci = { ...(this.state.katilimci), form: this.state.cevaplar }
            await firestore.collection("katilimci").doc(this.state.katilimci.id).set(katilimci)
            await this.setState(prev => ({ questionNumber: prev.questionNumber + 103, katilimci }))
        }
        catch (e) {
            notify({
                show: true,
                variant: "danger",
                text: "Bir hata oluştu"
            })
        }
    }
    gorusNext = (text) => {
        try {
            localStorage.setItem(
                "eval-token" + this.props.match.params.id,
                this.props.match.params.id
            );
            firestore.collection("katilimci").doc(this.state.katilimci.id).set({ ...(this.state.katilimci), gorus: text })
            this.setState(prev => ({ questionNumber: prev.questionNumber + 1 }))
        }
        catch (e) {
            notify({
                show: true,
                variant: "danger",
                text: "Bir hata oluştu"
            })
        }
    }

    onExited = _ => {
        let self = this
        setTimeout(_ => { self.setState(prev => ({ questionNumber: prev.questionNumber - 99 })) }, 500)
    }
    onKatilimci = item => {
        if (
            localStorage.getItem("eval-token" + this.props.match.params.id) ===
            this.props.match.params.id
        ) {
            notify({
                variant: "danger",
                text: `Birden fazla form doldurulamaz`
            });
        } else
            this.setState(prev => ({ katilimci: item, questionNumber: prev.questionNumber + 100, ...(item.form ? ({ cevaplar: item.form }) : ({})) }))
    }
    onScoreChange = (question, answer) => {
        let arr = [...(this.state.cevaplar)];
        arr[question] = answer;
        this.setState({ cevaplar: arr })
        console.log(arr, question)
    }
    cevapControl = (first, last) => {
        for (let i = first; i < last; i++)
            if (this.state.cevaplar[i] === 0) return false
        return true
    }
    render() {
        return (
            <React.Fragment>
                <Header notAdmin={true} history={this.props.history} />
                <div className="container">
                    {
                        this.questions.map((question, i) =>
                            <EvalCard
                                onExited={i % 4 === 3 ? this.onExited : () => { }}
                                question={question}
                                key={i}
                                i={i}
                                in={(this.state.questionNumber < 4) === (i < 4) && this.state.questionNumber !== -1 && this.state.questionNumber < 8}
                                onScoreChange={this.onScoreChange}
                                next={this.next}
                                showNext={i % 4 === 3}
                                nextActive={(i < 4) ? this.cevapControl(0, 4) : this.cevapControl(4, 8)}
                            />

                        )
                    }
                    <KatilimciCard
                        katilimcilar={this.state.katilimcilar}
                        onExited={this.onExited}
                        in={this.state.questionNumber === -1}
                        next={this.next}
                        onKatilimci={this.onKatilimci}
                    />
                    <GorusCard
                        in={this.state.questionNumber === this.questions.length}
                        next={this.gorusNext}
                    />
                    <FinishedCard
                        in={this.state.questionNumber === this.questions.length + 1}
                    />
                </div>


            </React.Fragment>
        );
    }
}

export default GunlukYoklama;
