package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

type list struct {
	NamaToken     string
	StatusVerif   string
	Platform      string
	St_read       string
	SelisihPersen string
	SelisihEth    string
	Buy_from      string
	Sell_to       string
	Detail_pair   string
	UniqKey       string
	ComparizonKey string
}

type detail struct {
	LastScan   string
	DetailData string
}

type notification struct {
	NamaToken     string
	LevelNotif    string
	LogoToken     string
	StatusVerif   string
	SelisihPersen string
	SelisihEth    string
}

type CommentData struct {
	TokenName   string `json:"token_name"`
	Comment     string `json:"comment"`
	StatusVerif string `json:"status_verif"`
}

type CompareData struct {
	TokenName string   `json:"token_name"`
	CompareBo []string `json:"compare_bo"`
	CompareSo []string `json:"compare_so"`
}

func main() {
	WebServer()
}

func WebServer() {
	// routing func
	Route()

	//serve address
	var address = "192.168.1.198:8080"
	fmt.Printf("server started at http://%s\n", address)

	server := new(http.Server)
	server.Addr = address
	server.ReadTimeout = time.Second * 10
	server.WriteTimeout = time.Second * 10

	err := server.ListenAndServe()
	if err != nil {
		fmt.Println(err.Error())
	}
}

func Route() {
	// static html
	html := http.FileServer(http.Dir("./public"))
	http.Handle("/", http.StripPrefix("/main_go/", html))

	// get data route
	http.HandleFunc("/get-list", ListToken)
	http.HandleFunc("/read-status", ReadToken)
	http.HandleFunc("/detail-token", TokenDetail)
	http.HandleFunc("/notification", Notification)
	http.HandleFunc("/get-price", GetPrice)
	http.HandleFunc("/comment", Comment)

}

// konek db
func connect() (*sql.DB, error) {
	db, err := sql.Open("mysql", "aang:aang@tcp(192.168.1.254:3306)/arbiterosv2_go")
	if err != nil {
		return nil, err
	}

	return db, nil
}

// fungsi get listToken
func ListToken(w http.ResponseWriter, r *http.Request) {
	db, err := connect()
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	defer db.Close()

	if r.Method == "POST" {
		var querySort string
		// do with post data
		r.ParseForm()
		if r.FormValue("sort_by") == "default" {
			querySort = `SELECT namaToken, statusVerif, platform, st_read, selisihPersen, selisihEth, buy_from, sell_to, detail_pair, UniqKey, ComparizonKey 
			FROM hasilscan 
			ORDER BY case when statusVerif = '1' then 1
						  when statusVerif = '2' then 3
						  when statusVerif = '3' then 2
					end ASC, selisihPersen + 0 DESC`
		} else if r.FormValue("sort_by") == "verified" {
			querySort = `SELECT namaToken, statusVerif, platform, st_read, selisihPersen, selisihEth, buy_from, sell_to, detail_pair, UniqKey, ComparizonKey 
			FROM hasilscan
			WHERE statusVerif = 1 
			ORDER BY selisihPersen + 0 DESC`
		} else if r.FormValue("sort_by") == "warning" {
			querySort = `SELECT namaToken, statusVerif, platform, st_read, selisihPersen, selisihEth, buy_from, sell_to, detail_pair, UniqKey, ComparizonKey 
			FROM hasilscan
			WHERE statusVerif = 2 
			ORDER BY selisihPersen + 0 DESC`
		} else if r.FormValue("sort_by") == "unverified" {
			querySort = `SELECT namaToken, statusVerif, platform, st_read, selisihPersen, selisihEth, buy_from, sell_to, detail_pair, UniqKey, ComparizonKey 
			FROM hasilscan
			WHERE statusVerif = 3 
			ORDER BY selisihPersen + 0 DESC`
		}

		rows, err := db.Query(querySort)
		if err != nil {
			fmt.Println(err.Error())
			return
		}
		defer rows.Close()

		// proses hasil query
		var result []list

		// read hasil query
		for rows.Next() {
			var each = list{}
			var err = rows.Scan(&each.NamaToken, &each.StatusVerif, &each.Platform, &each.St_read, &each.SelisihPersen, &each.SelisihEth, &each.Buy_from, &each.Sell_to, &each.Detail_pair, &each.UniqKey, &each.ComparizonKey)

			if err != nil {
				fmt.Println(err.Error())
				return
			}

			result = append(result, each)
		}

		if err = rows.Err(); err != nil {
			fmt.Println(err.Error())
			return
		}

		// return semua token
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(result)
	}
}

// read status
func ReadToken(w http.ResponseWriter, r *http.Request) {
	db, err := connect()
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	defer db.Close()

	if r.Method == "POST" {
		var currentToken string
		r.ParseForm()
		currentToken = r.FormValue("read_status")
		_, err = db.Exec("UPDATE hasilscan SET st_read = 1 WHERE UniqKey = ?", currentToken)
		if err != nil {
			fmt.Println(err.Error())
			return
		} else {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode("sukses")
		}

	}
}

// func detailData
func TokenDetail(w http.ResponseWriter, r *http.Request) {
	db, err := connect()
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	defer db.Close()

	if r.Method == "POST" {
		var result = detail{}
		var token string
		r.ParseForm()
		token = r.FormValue("token_name")
		err = db.QueryRow("SELECT last_scan,json_detail FROM detail_hasil_scan WHERE namaToken = ?", token).
			Scan(&result.LastScan, &result.DetailData)
		if err != nil {
			fmt.Println(err.Error())
			return
		}
		// return detail token
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(result)
	}
}

func Notification(w http.ResponseWriter, r *http.Request) {
	db, err := connect()
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	defer db.Close()

	if r.Method == "POST" {
		var queryNotif string
		// do with post data
		r.ParseForm()
		if r.FormValue("sort_by") == "default" {
			queryNotif = `SELECT namaToken, level_notif, logo_token, status_verif, selisih_persen, selisih_eth
			FROM notif 
			WHERE status_verif!='2'`
		} else if r.FormValue("sort_by") == "verified" {
			queryNotif = `SELECT namaToken, level_notif, logo_token, status_verif, selisih_persen, selisih_eth
			FROM notif 
			WHERE status_verif='1'`
		} else if r.FormValue("sort_by") == "warning" {
			queryNotif = `SELECT namaToken, level_notif, logo_token, status_verif, selisih_persen, selisih_eth
			FROM notif 
			WHERE status_verif='2' AND status_verif='2'`
		} else if r.FormValue("sort_by") == "unverified" {
			queryNotif = `SELECT namaToken, level_notif, logo_token, status_verif, selisih_persen, selisih_eth
			FROM notif 
			WHERE status_verif='3'`
		}

		rows, err := db.Query(queryNotif)
		if err != nil {
			fmt.Println(err.Error())
			return
		}
		defer rows.Close()

		// proses hasil query
		var notif []notification
		var notificationFinal []notification
		// read hasil query
		for rows.Next() {
			var each = notification{}
			var err = rows.Scan(&each.NamaToken, &each.LevelNotif, &each.LogoToken, &each.StatusVerif, &each.SelisihPersen, &each.SelisihEth)

			if err != nil {
				fmt.Println(err.Error())
				return
			}

			notif = append(notif, each)
		}

		if err = rows.Err(); err != nil {
			fmt.Println(err.Error())
			return
		}

	out:
		for i := 0; i < len(notif); i++ {
			for k := 0; k < len(notificationFinal); k++ {
				if notif[i].NamaToken == notificationFinal[k].NamaToken {
					if notif[i].LevelNotif < notificationFinal[k].LevelNotif {
						notificationFinal[k].LevelNotif = notif[i].LevelNotif
					}
					continue out
				}
			}
			notificationFinal = append(notificationFinal, notif[i])
		}

		// return semua token
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(notificationFinal)
	}
}

func GetPrice(w http.ResponseWriter, r *http.Request) {
	var data CompareData
	var token string
	var compare_bo []string
	var compare_so []string

	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	} else {
		token = data.TokenName
		compare_bo = data.CompareBo
		compare_so = data.CompareSo
		fmt.Println("Nama Token :", token)
		fmt.Println("Compare BO :", compare_bo)
		fmt.Println("Compare SO :", compare_so)

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode("sukses")
	}
}

// read status
func Comment(w http.ResponseWriter, r *http.Request) {
	db, err := connect()
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	defer db.Close()

	var data CommentData
	var token string
	var comment string
	var status string

	err = json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	token = data.TokenName
	comment = data.Comment
	status = data.StatusVerif

	_, err = db.Exec("UPDATE token SET status_verif = ? , comment = ? WHERE namaToken = ?", status, comment, token)
	if err != nil {
		fmt.Println(err.Error())
		return
	} else {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode("sukses")
	}

}
