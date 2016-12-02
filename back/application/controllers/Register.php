<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Register extends CI_Controller {
   public function __construct() {
        parent::__construct();
    }
	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see https://codeigniter.com/user_guide/general/urls.html
	 */
	 public function index()
	{
		$this->load->view('welcome_message');
	} 
	
	public function register()
	{
		$email = $this->input->post('email');
		$name = $this->input->post('name');
		$q=$this->db->get_where('registereds',array('email'=>$email));
		if($q->num_rows()==0){
			//belum terdaftar
			//add
			if(	$this->db->insert('registereds',array('name'=>$name,'email'=>$email))){
				$status='registered';				
			}else{
				$status='unregistered';
			}
		}else{
			//sudah terdaftar
			$status='registered';
		}
		echo json_encode(array('status'=>$status));
	}
}
